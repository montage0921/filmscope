THEATRE_NAMES = ["tiff", "paradise"]
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
    },
    "paradise":{
        "website":"https://paradiseonbloor.com/coming-soon/", # main entry
        "showpage_xpath":"//a[@class='title']", # each movie page's link
        "excluded_tags":["footer","header"], 
        "excluded_selectors":[],
        "button_clicked": ""
    }
}
