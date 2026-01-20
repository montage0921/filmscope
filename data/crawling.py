from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import asyncio
from crawl4ai import AsyncWebCrawler,CrawlerRunConfig, BrowserConfig
from google import genai
import json
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from dotenv import load_dotenv
import psycopg
import os
import requests

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found, please check your .env file")
client = genai.Client(api_key=API_KEY)

options = Options()
driver = webdriver.Chrome(options=options)
THEATRE_WEBSITES ={
    "tiff":{
        "website":"https://www.tiff.net/calendar", # main entry
        "showpage_xpath":"//h3[contains(@class, 'cardTitle')]//a", # each movie page's link
        "excluded_tags":["footer"], 
        "excluded_selectors":['[aria-label="Other Film Recommendations slider section"]','[id="openLegendModal"]'],
        "button_clicked": """
                            const button = document.querySelector('button[aria-label="Toggle show more showtimes"]');
                            if (button) {
                                button.click();
                            }
                            """
    }
}

class Film(BaseModel):
    film_title:str
    release_year:Optional[int]
    director:Optional[str]

class Screening(BaseModel):
    start_date:str=Field(description="Date in YYYY-MM-DD format. Assume the year is 2026 if not specified.")
    start_time:str=Field(description="24-hour time in HH:MM:SS format")
    ticket_url:str

class Show(BaseModel):
    theatre: Literal["TIFF Lightbox", "Paradise Theatre"] = Field(
                description="The specific theatre name. Must match exactly")
    show_title:str
    films:List[Film]
    special:Optional[str]=Field(
            description="EXTREMELY CONCISE: Only include format (e.g., '4K', '35mm'), "
                        "anniversaries (e.g., '50th Anniv'), or event types (e.g., 'Activity at 6pm'). "
                        "Remove all full sentences and marketing descriptions."
        )
    qa_with:Optional[str]
    screenings:List[Screening]

def extract_show_links(theatre):
    show_links = set()
    config = THEATRE_WEBSITES.get(theatre)
    driver.get(config["website"])
    try:
        wait = WebDriverWait(driver, 10) # wait up to 10s
        elements = wait.until(
            EC.presence_of_all_elements_located((By.XPATH, config["showpage_xpath"]))
        ) # wait until desired element found or time out (wait)
        for el in elements:
            show_links.add(el.get_attribute("href"))
        return show_links
    except Exception as e:
        print(f"Error or Timeout:{e}")

async def crawl_shows(show_links, theatre):
    # Browser Config
    browseConfig = BrowserConfig(
        headless=False,
        verbose=True
    )

    theatreConfig = THEATRE_WEBSITES.get(theatre,{})
    excluded_tags = theatreConfig.get("excluded_tags",[])
    excluded_selectors = (", ").join(theatreConfig.get("excluded_selectors",[]))
    js_code = theatreConfig.get("button_clicked","")

    crawlerConfig = CrawlerRunConfig(
        # specify which tags doesn't need to crawl
        excluded_tags = excluded_tags,
        excluded_selector = excluded_selectors,
        remove_forms=True,
        exclude_social_media_links=True,
        exclude_external_links=False,
        exclude_all_images=True,
        # specify JS operation
        js_code=js_code,
        # specify wait time
        delay_before_return_html=3.0, # This tells the crawler to stay on the page for 3 seconds before crawling
        page_timeout=60000 # if the crawling didn't finish in page_timeout seconds, stop the crawling
    )
    showDataCollections = []
    async with AsyncWebCrawler(config=browseConfig) as crawler:
        # crawl show page and convert it to markdown
        results = await crawler.arun_many(urls=list(show_links),config=crawlerConfig)
        count = 0
        for res in results:
            if res.success:
                try:
                    # crawl desired data from the markdown using AI
                    showData = await crawl_movie_data(markdown=res.markdown)
                    if showData:
                        showDataCollections.append(showData)
                except Exception as e:
                    print(f"Gemini API error for {res.url}:{e}")
                count += 1
            else:
                print("CRAWL FAILED")
            if count == 3:
                return showDataCollections

async def crawl_movie_data(markdown):
    response = await client.aio.models.generate_content(
        model = "gemini-2.5-flash",
        contents=[markdown],
        config={
            "response_mime_type":"application/json",
            "response_schema":Show
        }
    )

    return response.parsed

# ============ DATABASE ==========================
# for database connection
DATABASE_NAME = os.getenv("DATABASE_NAME")
USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

# DATA MODEL
class Film_Detail(BaseModel):
    title:str
    year:int
    director:str
    runtime:Optional[int] = None
    tconst:Optional[str] = None
    poster:Optional[str] = None
    backdrop:Optional[str] = None
    casts:Optional[str] = ""
    countries:Optional[str] = ""
    languages:Optional[str] = ""
    original_title:Optional[str] = ""
    genres:Optional[List[str]] = []


# connect to database
def connect_database():
    try:
        conn = psycopg.connect(
                dbname=DATABASE_NAME,
                user=USER,
                password=PASSWORD,
                host=HOST,
                port=PORT
            )
        return conn
    except psycopg.OperationalError as e:
        print(f"FAILED: {e}")
        return None

def get_film_id(film, cur):
    cur.execute("""
        SELECT film_id from films WHERE title = %s and year = %s
        """, (film.film_title, film.release_year))
    result = cur.fetchone()
    if result is None:
        return None
    else:
        return result[0]

def get_genre_id(genre, cur):
    cur.execute("""
        SELECT genre_id from genres WHERE genre = %s
        """, (genre, ))
    result = cur.fetchone()
    if result is None:
        return None
    else:
        return result[0]


def get_theatre_id(theatre, cur):
    cur.execute("""
        SELECT theatre_id from theatre WHERE name = %s
        """, (theatre,))
    result = cur.fetchone()
    if result is None:
        return None
    else:
        return result[0]

def fetch_movie_info_from_TMDB(film):
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_API_KEY}"
    }

    url_to_get_id = f"https://api.themoviedb.org/3/search/movie?query={film.film_title}&include_adult=true&language=en-US&page=1&primary_release_year={film.release_year}"
    response = requests.get(url_to_get_id, headers=headers).json()
    
    results = response["results"]
    if len(results) > 0:
        id = results[0]["id"]
        url_to_get_detailedInfo = f"https://api.themoviedb.org/3/movie/{id}?language=en-US&append_to_response=credits"
        response = requests.get(url_to_get_detailedInfo, headers=headers).json()
        year = int(response.get("release_date").split("-")[0]) if response.get("release_date") else -1
        directors = ("/").join([people.get("name") for people in response.get("credits", {}).get("crew", []) if people.get("job") == "Director"])
        casts = ("/").join([people.get("name") for people in response.get("credits", {}).get("cast", [])[:5]]) # pick first 5 actors
        countries = ("/").join([country.get("name") for country in response.get("production_countries") or []])
        languages = ("/").join([language.get("english_name") for language in response.get("spoken_languages",[])])
        genres = [genre.get("name") for genre in response.get("genres",[])]

        film_details = Film_Detail(
            title = response.get("title"),
            year = year,
            director = directors,
            runtime = int(response.get("runtime")) if response.get("runtime") else None,
            tconst = response.get("imdb_id"),
            poster = response.get("poster_path"),
            backdrop = response.get("backdrop_path"),
            casts = casts,
            countries = countries,
            languages = languages,
            original_title = response.get("original_title"),
            genres = genres # list
        )
    else:
        film_details = Film_Detail(
            title= film.film_title,
            year = film.release_year,
            director = film.director
        )
    return film_details

def store_to_shows(show, theatre_id, cur):
    cur.execute("""
                INSERT INTO shows(theatre_id, show_name, special, qa_with)
                VALUES(%s, %s, %s, %s)
                RETURNING show_id
                """,
                (theatre_id,
                 show.show_title,
                 show.special,
                 show.qa_with))
    return cur.fetchone()[0]

def store_to_films(fd, cur):
    cur.execute("""
                INSERT INTO films (title, year, director, runtime, tconst, poster, backdrop, casts, countries, original_title, languages)
                VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING film_id
                """, 
                (fd.title, 
                 fd.year,
                 fd.director, 
                 fd.runtime, 
                 fd.tconst, 
                 fd.poster, 
                 fd.backdrop, 
                 fd.casts, 
                 fd.countries,  
                 fd.original_title,
                 fd.languages,))
    return cur.fetchone()[0]

def store_to_screenings(screenings, show_id, cur):
    for s in screenings:
        cur.execute("""
        INSERT INTO screenings(show_id, start_date, start_time, ticket_url)
        VALUES(%s, %s, %s, %s)
        """,
        (
            show_id,
            s.start_date,
            s.start_time,
            s.ticket_url
        ))
    return

def store_to_showfilm(show_id, film_id, cur):
    cur.execute("""
        INSERT INTO show_films(show_id, film_id)
        VALUES(%s, %s)
        """,(show_id, film_id))
    return

def store_to_genres(genre, cur):
    cur.execute("""
        INSERT INTO genres(genre)
        VALUES(%s)
        RETURNING genre_id
        """,(genre, ))
    return cur.fetchone()[0]

def store_to_genrefilm(genre_id, film_id, cur):
    cur.execute("""
        INSERT INTO genre_film(genre_id, film_id)
        VALUES(%s, %s)
        """,(genre_id, film_id))
    return

if __name__ == "__main__":
    show_links = extract_show_links("tiff")
    conn = connect_database()
    if conn:
        try:
            if show_links:
                showDataCollection = asyncio.run(crawl_shows(show_links, "tiff"))
                for show in showDataCollection:
                    try:
                        with conn.cursor() as cur:
                            # store show
                            theatre_id = get_theatre_id(show.theatre,cur)
                            show_id = store_to_shows(show, theatre_id, cur)
                            store_to_screenings(show.screenings, show_id, cur)
                            # store film
                            for film in show.films:
                                try:
                                    with conn.transaction():
                                        film_id = get_film_id(film, cur)
                                        if film_id is None:
                                            # fetch detailed movie info from TMDB API
                                            film_details = fetch_movie_info_from_TMDB(film)

                                            # store detailed movie info to <films> table
                                            film_id = store_to_films(film_details, cur)

                                            if film_details.genres:
                                                for g in film_details.genres:
                                                    genre_id = get_genre_id(g, cur)
                                                    if not genre_id:
                                                        genre_id = store_to_genres(g, cur)
                                                    store_to_genrefilm(genre_id, film_id, cur)
                                            
                                        # store show-film relationship
                                        store_to_showfilm(show_id, film_id, cur)
                                except Exception as e:
                                    print(f"Error when storing film:{e}")
                                    print(film)
                                    print("========================")
                            conn.commit()
                    except Exception as e:
                        print(f"Error when storing show:{e}")
                        print(show)
                        conn.rollback()
                        print("========================")
        except Exception as e:
            print(f"Something went wrong: {e}")
        finally:
            conn.close()
