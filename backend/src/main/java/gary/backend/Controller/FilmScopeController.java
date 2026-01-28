package gary.backend.Controller;

import org.springframework.web.bind.annotation.RestController;

import gary.backend.DTO.FilmDto;
import gary.backend.DTO.ShowDescriptionDto;
import gary.backend.Entity.Film;
import gary.backend.Entity.Show;
import gary.backend.Entity.Theatre;
import gary.backend.Service.FilmScopeService;
import jakarta.websocket.server.PathParam;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@AllArgsConstructor
@RestController
public class FilmScopeController {
    private final FilmScopeService filmScopeService;

    @GetMapping("/theatres")
    public List<Theatre> getAllTheatres(){
        return filmScopeService.getAllTheatres();
    }

    @GetMapping("/shows/{id}")
    public Show getShowById(@PathVariable int id) {
        return filmScopeService.getShowById(id);
    }

     @GetMapping("/films/{id}")
    public Film getFilmById(@PathVariable int id) {
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
    
    
    
    
    
}
