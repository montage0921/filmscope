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
from typing import List, Optional
from dotenv import load_dotenv
import os

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
    }
}

class Film(BaseModel):
    film_title:str
    release_year:Optional[str]
    director:Optional[str]

class Screening(BaseModel):
    start_date:str=Field(description="Date in YYYY-MM-DD format. Assume the year is 2026 if not specified.")
    start_time:str=Field(description="24-hour time in HH:MM:SS format")
    ticket_url:str

class Show(BaseModel):
    theatre:str
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

    crawlerConfig = CrawlerRunConfig(
        excluded_tags = excluded_tags,
        excluded_selector = excluded_selectors,
        remove_forms=True,
        exclude_social_media_links=True,
        exclude_external_links=False,
        exclude_all_images=True,
        # This tells the crawler to stay on the page for 3 seconds before crawling
        delay_before_return_html=3.0,
        # if the crawling didn't finish in page_timeout seconds, stop the crawling
        page_timeout=60000
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
        

if __name__ == "__main__":
    show_links = extract_show_links("tiff")
    if show_links:
        showDataCollection = asyncio.run(crawl_shows(show_links, "tiff"))
        for showData in showDataCollection:
            print("============= SHOW DATA ==============")
            print(showData)
            print("============= SHOW DATA ==============")
