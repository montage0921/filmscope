package gary.backend.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilmDto {
    private int film_id;
    private String title;
    private String directors;
    private String backdrop;
    private List<String> genres;

}
