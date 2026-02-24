package gary.backend.DTO;

import java.util.List;

import gary.backend.Entity.Screening;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateShowDto {
    private ShowBasicUpdateDto showBasicUpdateDto;
    private int theatre_id;
    private Integer film_id;
    private List<Screening> screenings;

}
