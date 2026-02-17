package gary.backend.DTO;

import java.util.Set;

import gary.backend.Entity.Film;
import gary.backend.Entity.Screening;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDto {
    private int user_id;
    private String username;
    private String email;
    private boolean enabled;
    private Set<String> authorities;
    private Set<Film> films;
    private Set<Screening> screenings;
}
