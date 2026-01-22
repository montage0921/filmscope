from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from dotenv import load_dotenv
import asyncio
from crawl4ai import AsyncWebCrawler,CrawlerRunConfig, BrowserConfig
from google import genai
import random
from config import THEATRE_WEBSITES
from model import Show

# load GEMINI client
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found, please check your .env file")
client = genai.Client(api_key=API_KEY)



def extract_show_links(theatre):
    """
    Scrapes a theatre's main calendar page to find individual movie showpage links.

    This function uses Selenium to navigate to the theatre's website, waits for 
    specific elements defined by XPath to appear, and extracts their 'href' attributes.

    Args:
        theatre (str): The key identifying the theatre (e.g., 'tiff' or 'paradise') 
            to look up in the THEATRE_WEBSITES configuration.

    Returns:
        set: A collection of unique URLs (strings) pointing to individual show pages. 
            Returns None or an empty set if an error occurs.
    """
    # load Selenium Driver
    options = Options()
    driver = webdriver.Chrome(options=options)
    config = THEATRE_WEBSITES.get(theatre)
    driver.get(config["website"])

    show_links = set()
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
    finally:
        driver.quit()


async def crawl_movie_data(markdown):
    """
    Using Gemini to crawl detailed show information

    Args:
        markdown (text): The markdown converted from HTML file of each page

    Returns:
        Show: The returned result from AI will follow Show schema
    """
    
    response = await client.aio.models.generate_content(
        model = "gemini-2.5-flash",
        contents=[markdown],
        config={
            "response_mime_type":"application/json",
            "response_schema":Show
        }
    )

    return response.parsed

def getConfig(theatre, lockCnt, isHeadless, wait_time, timeout):
    """
    Return config needed for crawl4AI

    Args:
        theatre(str): based on this to fetch config related to the specific movie theatre
        lockCnt: how many concurrent pages allowed
        isHeadless: using headless browser or not
        wait_time: how many time stay on each page
        timeout: if the crawling didn't finish in timeout seconds, stop the crawling

    Returns:
        browseConfig: config headless or head browser
        semaphore: return a semaphore object
        crawlerConfig: config for crawl4AI
    """
    # Browser Config
    browseConfig = BrowserConfig(
        headless=isHeadless,
        verbose=True
    )

    semaphore = asyncio.Semaphore(lockCnt) # only allow 3 concurrent pages

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
        delay_before_return_html = wait_time, # This tells the crawler to stay on the page for 3 seconds before crawling
        page_timeout = timeout # if the crawling didn't finish in page_timeout seconds, stop the crawling
    )

    return semaphore, crawlerConfig, browseConfig


async def crawl_shows(show_links, theatre):
    """
    Call crawl_movie_data for each show_link to crawl the desired info about show
    Then return a collection of those info

    Args:
        show_links(list): The markdown converted from HTML file of each page

    Returns:
        Show: The returned result from AI will follow Show schema
    """
    
    semaphore, crawlerConfig, browseConfig = getConfig(theatre, 10, True, 3, 60000)

    async def throttled_arun(link, crawler):
        async with semaphore:
            await asyncio.sleep(random.uniform(1,3))
            return await crawler.arun(url=link, config=crawlerConfig)

    showDataCollections = []

    async with AsyncWebCrawler(config=browseConfig) as crawler:
        tasks = [throttled_arun(link, crawler) for link in list(show_links)]
        results = await asyncio.gather(*tasks)
        for res in results:
            if res.success:
                try:
                    # crawl desired data from the markdown using AI
                    showData = await crawl_movie_data(markdown=res.markdown)
                    if showData:
                        showDataCollections.append(showData)
                except Exception as e:
                    print(f"Gemini API error for {res.url}:{e}")
            else:
                print("CRAWL FAILED")
        print(f"crawled {len(showDataCollections)} pages")
        return showDataCollections

