package gary.backend.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import gary.backend.DTO.DetailedFilmPageDto;
import gary.backend.DTO.FilmDto;
import gary.backend.DTO.ScreeningDto;
import gary.backend.DTO.ShowDescriptionDto;
import gary.backend.DTO.ShowDto;
import gary.backend.Entity.Film;
import gary.backend.Entity.Genre;
import gary.backend.Entity.Screening;
import gary.backend.Entity.Show;
import gary.backend.Entity.Theatre;
import gary.backend.Repository.FilmRepository;
import gary.backend.Repository.GenreRepository;
import gary.backend.Repository.ShowRepository;
import gary.backend.Repository.TheatreRepository;
import lombok.AllArgsConstructor;

@AllArgsConstructor

@Service
public class FilmScopeService {
    private final TheatreRepository theatreRepository;
    private final ShowRepository showRepository;
    private final FilmRepository filmRepository;
    private final GenreRepository genreRepository;

    // for testing
    public List<Theatre> getAllTheatres() {
        return theatreRepository.findAll();
    }

    // get show by id
    public Show getShowById(int id) {
        return showRepository.findById(id).orElseThrow(() -> new RuntimeException(
                "Show not found with id: " + id));
    }

    // get film by id
    public DetailedFilmPageDto getFilmById(int id) {
        Film film = filmRepository.findById(id).orElseThrow(() -> new RuntimeException(
                "Show not found with id: " + id));

        int film_id = film.getFilm_id();
        String title = film.getTitle();
        int year = film.getYear();
        String directors = film.getDirector();
        int runtime = film.getRuntime();
        String tconst = film.getTconst();
        String poster = film.getPoster();
        String backdrop = film.getBackdrop();
        String casts = film.getCasts();
        String countries = film.getCountries();
        String original_title = film.getOriginal_title();
        String languages = film.getLanguages();
        String plot = film.getPlot();
        List<Genre> genres = film.getGenres();
        int likedCnt = film.getLikedBy().size();

        List<Show> shows = film.getShows();
        Map<String, Map<LocalDate, Map<String, ShowDto>>> showInfoByDate = new HashMap<>();
        for (Show s : shows) {
            String theatre = s.getTheatre().getName();
            List<Screening> screenings = s.getScreenings();

            List<ScreeningDto> screeningDtos = new ArrayList<>();
            for (Screening sc : screenings) {
                int screening_id = sc.getScreening_id();
                LocalDate star_date = sc.getStart_date();
                LocalTime start_time = sc.getStart_time();
                String ticket_url = sc.getTicket_url();

                ScreeningDto screeningDto = new ScreeningDto();
                screeningDto.setScreening_id(screening_id);
                screeningDto.setStart_time(start_time);
                screeningDto.setTicket_url(ticket_url);

                screeningDtos.add(screeningDto);

                showInfoByDate.computeIfAbsent("show_info", k -> new HashMap<>())
                        .computeIfAbsent(star_date, k -> new HashMap<>())
                        .put(theatre, new ShowDto(
                                s.getShow_id(),
                                s.getShow_name(),
                                s.getSpecial(),
                                s.getQa_with(),
                                screeningDtos));
            }
        }

        return new DetailedFilmPageDto(
                film_id, title, year, directors, runtime, tconst, poster, backdrop, casts, countries,
                original_title, languages, plot, genres, showInfoByDate, likedCnt);
    }

    // get show description (show_name, theatre, film, earliest_date)
    public List<ShowDescriptionDto> getShowDescriptionDtos() {
        List<Object[]> allShowDescriptions = showRepository.findShowDescription();
        return allShowDescriptions.stream().map(show -> new ShowDescriptionDto(
                ((Number) show[0]).intValue(),
                (String) show[1],
                (String) show[2],
                (String) show[3],
                (java.time.LocalDate) show[4])).toList();

    }

    // get all filmsDtos
    public List<FilmDto> getAllFilms() {
        List<Object[]> res = filmRepository.findAllFilmDto();
        return res.stream().map(item -> {
            String genres = item[4] != null ? (String) item[4] : "";
            List<String> genresList = Arrays.stream(genres.split(",")).map(String::trim).toList();
            return new FilmDto(
                    ((Number) item[0]).intValue(),
                    (String) item[1],
                    (String) item[2],
                    (String) item[3],
                    genresList);
        }).toList();
    }

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    // update basic film info (except genres)
    public ResponseEntity<String> updateFilmInfo(int film_id, Map<String, String> updated) {
        Film film = filmRepository.findById(film_id).orElseThrow(() -> new RuntimeException("Film not found"));
        updated.forEach((key, value) -> {
            switch (key) {
                case "title":
                    film.setTitle(value);
                    break;
                case "year":
                    film.setYear(Integer.valueOf(value));
                    break;
                case "director":
                    film.setDirector(value);
                    break;
                case "runtime":
                    film.setRuntime(Integer.valueOf(value));
                    break;
                case "tconst":
                    film.setTconst(value);
                    break;
                case "poster":
                    film.setPoster(value);
                    break;
                case "backdrop":
                    film.setBackdrop(value);
                    break;
                case "casts":
                    film.setCasts(value);
                    break;
                case "countries":
                    film.setCountries(value);
                    break;
                case "languages":
                    film.setLanguages(value);
                    break;
                case "plot":
                    film.setPlot(value);
                    break;
                case "original_title":
                    film.setOriginal_title(value);
            }
        });
        filmRepository.save(film);
        return ResponseEntity.ok("Movie info has been successfully updated🎉");
    }

    public ResponseEntity<String> updateFilmGenre(int film_id, List<Genre> genres) {
        Film film = filmRepository.findById(film_id).orElseThrow(() -> new RuntimeException("Film not found"));
        film.setGenres(genres);
        filmRepository.save(film);

        return ResponseEntity.ok("Movie Genre has been successfully updated!");
    }

}
