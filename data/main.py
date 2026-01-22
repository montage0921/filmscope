from database import *
from crawl import *
from config import THEATRE_NAMES

if __name__ == "__main__":
    print("sdsdsdsd")
    conn = connect_database()
    print("sdsdsdsd")
    if conn:
        try:
            for theatre in THEATRE_NAMES:
                show_links = extract_show_links(theatre)
                if show_links:
                    showDataCollection = asyncio.run(crawl_shows(show_links, theatre))
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
                                            print(f"stored Film {film.film_title} successfully 🎞")
                                    except Exception as e:
                                        print(f"Error when storing film:{e}")
                                        print(film)
                                        print("========================")
                                print(f"stored Show {show.show_title} successfully 🎉💃")
                                print("============================================")
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
