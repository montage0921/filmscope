package gary.backend.Controller;

import org.springframework.web.bind.annotation.RestController;

import gary.backend.Entity.Theatre;
import gary.backend.Service.FilmScopeService;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;

@AllArgsConstructor
@RestController
public class FilmScopeController {
    private final FilmScopeService filmScopeService;
    
    @GetMapping("/theatres")
    public List<Theatre> getAllTheatres(){
        return filmScopeService.getAllTheatres();
    }
    
    
}
