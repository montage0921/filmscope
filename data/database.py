import psycopg
import requests
from model import Film_Detail
import os
from dotenv import load_dotenv

# for database connection
load_dotenv()
DATABASE_NAME = os.getenv("DATABASE_NAME")
USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

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
