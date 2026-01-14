from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import asyncio
from crawl4ai import AsyncWebCrawler,CrawlerRunConfig

options = Options()
driver = webdriver.Chrome(options=options)
THEATRE_WEBSITES ={
    "tiff":{
        "website":"https://www.tiff.net/calendar",
        "showpage_xpath":"//h3[contains(@class, 'cardTitle')]//a",
        "excluded_tags":["footer"],
        "excluded_selectors":['[aria-label="Other Film Recommendations slider section"]','[id="openLegendModal"]'],
    }
}

def extract_show_links(theatre):
    show_links = set()
    config = THEATRE_WEBSITES.get(theatre)
    driver.get(config["website"])
    try:
        wait = WebDriverWait(driver, 10) # wait up to 10s
        elements = wait.until(
            EC.presence_of_all_elements_located((By.XPATH, config["showpage_xpath"]))
        ) # wait until desired element found or time out
        for el in elements:
            show_links.add(el.get_attribute("href"))
        return show_links
    except Exception as e:
        print(f"Error or Timeout:{e}")

async def crawl_shows(show_links, theatre):
    theatreConfig = THEATRE_WEBSITES.get(theatre,{})
    excluded_tags = theatreConfig.get("excluded_tags",[])
    excluded_selectors = (", ").join(theatreConfig.get("excluded_selectors",[]))
    crawlerConfig = CrawlerRunConfig(
        excluded_tags = excluded_tags,
        excluded_selector = excluded_selectors,
        remove_forms=True,
        exclude_social_media_links=True,
        exclude_external_links=False,
        exclude_all_images=True
    )
    print(len(show_links))

    async with AsyncWebCrawler() as crawler:
        results = await crawler.arun_many(urls=list(show_links),config=crawlerConfig)
        count = 0
        for res in results:
            if res.success:
                print(f"--- Content for {res.url} ---")
                print(res.markdown)
                print("------------END---------------")
                count += 1
            else:
                count += 1
                print("FAILED")
            if count == 3:
                break

        

if __name__ == "__main__":
    show_links = extract_show_links("tiff")
    if show_links:
        asyncio.run(crawl_shows(show_links, "tiff"))
