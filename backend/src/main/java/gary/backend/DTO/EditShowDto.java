package gary.backend.DTO;

import java.util.List;

import gary.backend.Entity.Screening;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditShowDto {
    private int show_id;
    private String film_title;
    private String show_name;
    private String qa_with;
    private String special;
    private TheatreDto theatreDto;
    private List<Screening> screenings;

}
