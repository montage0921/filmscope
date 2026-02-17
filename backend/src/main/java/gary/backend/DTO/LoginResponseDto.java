package gary.backend.DTO;

import gary.backend.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginResponseDto {
    private String token;
    private UserDto userDto;
    private String errorMessage;
}
