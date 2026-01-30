package gary.backend.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowDto {
    private int show_id;
    private String show_title;
    private String special;
    private String qa_with;
    private List<ScreeningDto> screenings;
}
