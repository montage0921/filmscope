package gary.backend.Controller;

import org.springframework.web.bind.annotation.RestController;

import gary.backend.DTO.DetailedFilmPageDto;
import gary.backend.DTO.FilmDto;
import gary.backend.DTO.ShowDescriptionDto;
import gary.backend.Entity.Genre;
import gary.backend.Entity.Show;
import gary.backend.Entity.Theatre;
import gary.backend.Service.FilmScopeService;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = { "http://localhost:3000", "https://filmscope-lq18.onrender.com", "http://192.168.1.231:3000",
        "https://filmscope.onrender.com" })
public class FilmScopeController {
    private final FilmScopeService filmScopeService;

    @GetMapping("/theatres")
    public List<Theatre> getAllTheatres() {
        return filmScopeService.getAllTheatres();
    }

    @GetMapping("/shows/{id}")
    public Show getShowById(@PathVariable int id) {
        return filmScopeService.getShowById(id);
    }

    @GetMapping("/films/{id}")
    public DetailedFilmPageDto getFilmById(@PathVariable int id) {
        return filmScopeService.getFilmById(id);
    }

    @GetMapping("/shows")
    public List<ShowDescriptionDto> getAllShows() {
        return filmScopeService.getShowDescriptionDtos();
    }

    @GetMapping("/films")
    public List<FilmDto> getAllFilms() {
        return filmScopeService.getAllFilms();
    }

    @GetMapping("genres")
    public List<Genre> getAllGenres() {
        return filmScopeService.getAllGenres();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PatchMapping("/films/{film_id}")
    public ResponseEntity<String> updateFilmInfo(@PathVariable int film_id,
            @RequestBody Map<String, String> updated) {
        return filmScopeService.updateFilmInfo(film_id, updated);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/films/{film_id}/genres")
    public ResponseEntity<String> updateFilmGenre(@PathVariable int film_id,
            @RequestBody List<Genre> genres) {

        return filmScopeService.updateFilmGenre(film_id, genres);
    }

}
