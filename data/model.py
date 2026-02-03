from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class Film(BaseModel):
    film_title: str
    release_year: Optional[int]
    director: Optional[str]


class Screening(BaseModel):
    start_date: str = Field(
        description="Date in YYYY-MM-DD format. Assume the year is 2026 if not specified."
    )
    start_time: str = Field(description="24-hour time in HH:MM:SS format")
    ticket_url: str


class Show(BaseModel):
    theatre: Literal["TIFF Lightbox", "Paradise Theatre"] = Field(
        description="The specific theatre name. Must match exactly"
    )
    show_title: str
    films: List[Film]
    special: Optional[str] = Field(
        description="EXTREMELY CONCISE: Only include format (e.g., '4K', '35mm'), "
        "anniversaries (e.g., '50th Anniv'), or event types (e.g., 'Activity at 6pm'). "
        "Remove all full sentences and marketing descriptions."
    )
    qa_with: Optional[str]
    screenings: List[Screening]


# DATA MODEL
class Film_Detail(BaseModel):
    title: str
    year: int
    director: str
    runtime: Optional[int] = None
    tconst: Optional[str] = None
    poster: Optional[str] = None
    backdrop: Optional[str] = None
    casts: Optional[str] = ""
    countries: Optional[str] = ""
    languages: Optional[str] = ""
    original_title: Optional[str] = ""
    genres: Optional[List[str]] = []
    plot: Optional[str] = ""
