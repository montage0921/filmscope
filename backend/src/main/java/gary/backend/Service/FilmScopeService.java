package gary.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import gary.backend.Entity.Theatre;
import gary.backend.Repository.TheatreRepository;
import lombok.AllArgsConstructor;

@AllArgsConstructor

@Service
public class FilmScopeService {
    private final TheatreRepository theatreRepository;

    // for testing
    public List<Theatre> getAllTheatres(){
        return theatreRepository.findAll();
    }

}
