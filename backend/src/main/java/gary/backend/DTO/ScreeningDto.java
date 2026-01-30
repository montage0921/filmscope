package gary.backend.DTO;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScreeningDto {
    private int screening_id;
    private LocalTime start_time;
    private String ticket_url;
}
