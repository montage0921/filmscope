package gary.backend.Service;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import gary.backend.DTO.RegisterDto;
import gary.backend.Entity.User;
import gary.backend.Repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<String> register(RegisterDto registerDto) {

        String userName = registerDto.getUsername();
        String email = registerDto.getEmail();
        String hashedPassword = passwordEncoder.encode(registerDto.getPassword());

        // check if email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: the email already exists");
        }

        User newUser = new User();
        newUser.setUsername(userName);
        newUser.setEmail(email);
        newUser.setPassword(hashedPassword);
        newUser.setEnabled(true);
        newUser.setAuthorities(Set.of("ROLE_USER"));

        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("You registed successfully!");
    }

}
