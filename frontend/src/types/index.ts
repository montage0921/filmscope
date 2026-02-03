export interface Film{
    film_id:number,
    title:string,
    directors:string,
    backdrop:string,
    genres: string[]
}

export interface Show{
    show_id:number,
    show_title: string,
    special: string,
    qa_with: string
    screenings: Screening[]
}

export interface Screening{
    screening_id:number,
    start_time: string,
    ticket_url: string
}

export interface Genre{
    genre_id: number,
    genre:string
}

export interface DetailedFilmInfo{
    film_id:number,
    title: string,
    year: number,
    director: string,
    runtime: number,
    tconst: string,
    poster: string,
    backdrop: string,
    casts: string,
    countries: string,
    original_title: string,
    languages: string,
    plot:string
    genres: Genre[],
    showInfoBydate:Record<string, Record<string, Record<string, Show>>>

}

export interface TabItem{
    tabName:string,
    tabContent:Object
}
