package gary.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowBasicUpdateDto {
    private String show_name;
    private String qa_with;
    private String special;
}
