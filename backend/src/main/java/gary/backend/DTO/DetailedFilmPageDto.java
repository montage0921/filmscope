package gary.backend.DTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import gary.backend.Entity.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class DetailedFilmPageDto {
    private int film_id;
    private String title;
    private int year;
    private String director;
    private Integer runtime;
    private String tconst;
    private String poster;
    private String backdrop;
    private String casts;
    private String countries;
    private String original_title;
    private String languages;
    private String plot;
    private List<Genre> genres;
    private Map<String, Map<LocalDate, Map<String, ShowDto>>> showInfoByDate;
    private int likedCnt;
}
