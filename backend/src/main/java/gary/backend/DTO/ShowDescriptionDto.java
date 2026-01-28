package gary.backend.DTO;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowDescriptionDto {
    private int show_id;
    private String show_title;
    private String theatre;
    private String film;
    private LocalDate earilestDate;

}
