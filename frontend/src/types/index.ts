export interface Film {
  film_id: number;
  title: string;
  directors: string;
  backdrop: string;
  genres: string[];
}

export interface Show {
  show_id: number;
  show_title: string;
  special: string;
  qa_with: string;
  screenings: Screening[];
}

export interface Screening {
  screening_id: number;
  start_time: string;
  ticket_url: string;
}

export interface Genre {
  genre_id: number;
  genre: string;
}

export interface ShowInfo {
  show_id: number;
  show_title: string;
  qa_with: string | null;
  special: string | null;
  screenings: Screening[];
}

export type ShowInfoByDate = Record<string, Record<string, ShowInfo>>; // date:{theatre:ShowInfo}

export interface DetailedFilmInfo {
  film_id: number;
  title: string;
  year: number;
  director: string;
  runtime: number;
  tconst: string;
  poster: string;
  backdrop: string;
  casts: string;
  countries: string;
  original_title: string;
  languages: string;
  plot: string;
  genres: Genre[];
  showInfoByDate: Record<string, ShowInfoByDate>; // showinfo:{}
}

export interface TabItem {
  tabName: string;
  tabContent: Object;
}

export type Constraint = {
  id: string;
  message: string;
  valid: boolean;
};

export type BasicFilmInfo = {
  title: string;
  original_title: string;
  director: string;
  casts: string;
  runtime: number;
  year: number;
  countries: string;
  languages: string;
  poster: string;
  backdrop: string;
  plot: string;
};
