package gary.backend.Service;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import gary.backend.DTO.FilmDto;
import gary.backend.DTO.ShowDescriptionDto;
import gary.backend.Entity.Film;
import gary.backend.Entity.Screening;
import gary.backend.Entity.Show;
import gary.backend.Entity.Theatre;
import gary.backend.Repository.FilmRepository;
import gary.backend.Repository.GenreRepository;
import gary.backend.Repository.ScreeningRepository;
import gary.backend.Repository.ShowRepository;
import gary.backend.Repository.TheatreRepository;
import lombok.AllArgsConstructor;

@AllArgsConstructor

@Service
public class FilmScopeService {
    private final TheatreRepository theatreRepository;
    private final ShowRepository showRepository;
    private final FilmRepository filmRepository;
    private final ScreeningRepository screeningRepository;
    private final GenreRepository genreRepository;

    // for testing
    public List<Theatre> getAllTheatres(){
        return theatreRepository.findAll();
    }

    // get show by id
    public Show getShowById(int id){
        return showRepository.findById(id).orElseThrow(()->new RuntimeException(
            "Show not found with id: " + id
        ));
    }

    // get film by id
    public Film getFilmById(int id){
        return filmRepository.findById(id).orElseThrow(()->new RuntimeException(
            "Show not found with id: " + id
        ));
    }

    // get show description (show_name, theatre, film, earliest_date)
    public List<ShowDescriptionDto> getShowDescriptionDtos(){
        List<Object[]> allShowDescriptions = showRepository.findShowDescription();
        return allShowDescriptions.stream().map(show->new ShowDescriptionDto(
            ((Number) show[0]).intValue(),
            (String) show[1],
            (String) show[2],
            (String) show[3],
            (java.time.LocalDate) show[4]
        )).toList();
        
    }

    // get all filmsDtos
    public List<FilmDto> getAllFilms(){
        List<Object[]> res = filmRepository.findAllFilmDto();
        return res.stream().map(item -> {
            String genres  = item[4] != null ? (String) item[4]: "";
            List<String> genresList = Arrays.stream(genres.split(",")).map(String::trim).toList();
            return new FilmDto(
                ((Number) item[0]).intValue(),
                (String) item[1],
                (String) item[2],
                (String) item[3],
                genresList
            );
        }).toList();
    }


}
