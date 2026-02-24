package gary.backend.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import gary.backend.DTO.DetailedFilmPageDto;
import gary.backend.DTO.EditShowDto;
import gary.backend.DTO.FilmDto;
import gary.backend.DTO.ScreeningDto;
import gary.backend.DTO.ShowBasicUpdateDto;
import gary.backend.DTO.ShowDescriptionDto;
import gary.backend.DTO.ShowDto;
import gary.backend.DTO.TheatreDto;
import gary.backend.DTO.UpdateShowDto;
import gary.backend.Entity.Film;
import gary.backend.Entity.Genre;
import gary.backend.Entity.Screening;
import gary.backend.Entity.Show;
import gary.backend.Entity.Theatre;
import gary.backend.Repository.FilmRepository;
import gary.backend.Repository.GenreRepository;
import gary.backend.Repository.ScreeningRepository;
import gary.backend.Repository.ShowRepository;
import gary.backend.Repository.TheatreRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@AllArgsConstructor

@Service
public class FilmScopeService {
    private final TheatreRepository theatreRepository;
    private final ShowRepository showRepository;
    private final FilmRepository filmRepository;
    private final GenreRepository genreRepository;
    private final ScreeningRepository screeningRepository;

    // for testing
    public List<TheatreDto> getAllTheatres() {
        List<Theatre> allTheatres = theatreRepository.findAll();
        List<TheatreDto> allTheatresDto = new ArrayList<>();
        for (Theatre theatre : allTheatres) {
            TheatreDto theatreDto = new TheatreDto();
            theatreDto.setName(theatre.getName());
            theatreDto.setTheatre_id(theatre.getTheatre_id());
            allTheatresDto.add(theatreDto);
        }
        return allTheatresDto;
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

            for (Screening sc : screenings) {
                LocalDate star_date = sc.getStart_date();

                // 1. Get or create the ShowDto for this specific date and theatre
                Map<String, ShowDto> theatreMap = showInfoByDate
                        .computeIfAbsent("show_info", k -> new TreeMap<>()) // TreeMap keeps dates sorted
                        .computeIfAbsent(star_date, k -> new HashMap<>());

                ShowDto showDto = theatreMap.get(theatre);

                if (showDto == null) {
                    // First time seeing this theatre on this date, create a new ShowDto
                    showDto = new ShowDto(
                            s.getShow_id(),
                            s.getShow_name(),
                            s.getSpecial(),
                            s.getQa_with(),
                            new ArrayList<>() // Fresh list for THIS date/theatre combo
                    );
                    theatreMap.put(theatre, showDto);
                }

                // 2. Add ONLY this specific screening to the Dto's list
                ScreeningDto screeningDto = new ScreeningDto();
                screeningDto.setScreening_id(sc.getScreening_id());
                screeningDto.setStart_time(sc.getStart_time());
                screeningDto.setTicket_url(sc.getTicket_url());

                showDto.getScreenings().add(screeningDto);
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

    public ResponseEntity<List<EditShowDto>> getShowsForFilm(int film_id) {
        Optional<Film> opFilm = filmRepository.findById(film_id);
        if (!opFilm.isPresent())
            return ResponseEntity.notFound().build();

        Film film = opFilm.get();
        String film_title = film.getTitle();

        List<Show> shows = film.getShows();
        List<EditShowDto> editShowDtos = new ArrayList<>();
        for (Show show : shows) {
            EditShowDto editShowDto = new EditShowDto();
            editShowDto.setShow_id(show.getShow_id());
            editShowDto.setFilm_title(film_title);
            editShowDto.setShow_name(show.getShow_name());
            editShowDto.setQa_with(show.getQa_with());
            editShowDto.setSpecial(show.getSpecial());

            TheatreDto theatreDto = new TheatreDto();
            theatreDto.setName(show.getTheatre().getName());
            theatreDto.setTheatre_id(show.getTheatre().getTheatre_id());
            editShowDto.setTheatreDto(theatreDto);

            editShowDto.setScreenings(show.getScreenings());

            editShowDtos.add(editShowDto);
        }

        return ResponseEntity.ok(editShowDtos);
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

    @Transactional
    public ResponseEntity<String> updateFilmGenre(int film_id, List<Genre> genres) {
        Film film = filmRepository.findById(film_id).orElseThrow(() -> new RuntimeException("Film not found"));
        film.getGenres().clear();
        if (genres != null) {
            film.getGenres().addAll(genres);
        }
        filmRepository.save(film);

        return ResponseEntity.ok("Movie Genre has been successfully updated!");
    }

    @Transactional
    public ResponseEntity<String> updateShow(int show_id, UpdateShowDto updateShowDto) {
        Optional<Show> opShow = showRepository.findById(show_id);
        if (!opShow.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Please provide a valid show");
        }

        Optional<Theatre> opTheatre = theatreRepository.findById(updateShowDto.getTheatre_id());
        if (!opTheatre.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Please provide a valid theatre");
        }
        Theatre theatre = opTheatre.get();

        ShowBasicUpdateDto showBasicUpdateDto = updateShowDto.getShowBasicUpdateDto();
        if (showBasicUpdateDto.getShow_name() == null || showBasicUpdateDto.getShow_name().isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Show title cannot be empty");
        }

        Show show = opShow.get();
        show.setShow_name(showBasicUpdateDto.getShow_name());
        show.setQa_with(showBasicUpdateDto.getQa_with());
        show.setSpecial(showBasicUpdateDto.getSpecial());
        show.setTheatre(theatre);

        // updating screenings
        List<Screening> newScreenings = updateShowDto.getScreenings();
        show.getScreenings().clear();
        if (newScreenings != null) {
            show.getScreenings().addAll(newScreenings);
        }

        return ResponseEntity.ok("The show is successfully updated!");

    }

    @Transactional
    public ResponseEntity<String> addNewShow(UpdateShowDto updateShowDto) {
        ShowBasicUpdateDto showBasicUpdateDto = updateShowDto.getShowBasicUpdateDto();
        if (showBasicUpdateDto.getShow_name() == null || showBasicUpdateDto.getShow_name().isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Show title cannot be empty");
        }

        Optional<Theatre> opTheatre = theatreRepository.findById(updateShowDto.getTheatre_id());
        if (!opTheatre.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Please provide a valid theatre");
        }
        Theatre theatre = opTheatre.get();

        Show show = new Show();
        show.setShow_name(showBasicUpdateDto.getShow_name());
        show.setQa_with(showBasicUpdateDto.getQa_with());
        show.setSpecial(showBasicUpdateDto.getSpecial());
        show.setTheatre(theatre);

        Optional<Film> opFilm = filmRepository.findById(updateShowDto.getFilm_id());
        if (opFilm.isPresent()) {
            Set<Film> filmSet = new HashSet<>();
            filmSet.add(opFilm.get());
            show.setFilms(filmSet);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Film not found");
        }

        List<Screening> newScreenings = updateShowDto.getScreenings();
        if (newScreenings != null) {
            show.getScreenings().addAll(newScreenings);
        }
        showRepository.save(show);

        return ResponseEntity.ok("The show is successfully added!");
    }

    @Transactional
    public ResponseEntity<String> deleteScreening(int screening_id) {
        if (!screeningRepository.findById(screening_id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Screening doesn't exist");
        }
        screeningRepository.deleteById(screening_id);
        return ResponseEntity.ok("The screening is successfully deleted");
    }

    @Transactional
    public ResponseEntity<String> deleteShow(int show_id) {
        if (!showRepository.findById(show_id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Show doesn't exist");
        }
        showRepository.deleteById(show_id);
        return ResponseEntity.ok("The show is successfully deleted");
    }

}
