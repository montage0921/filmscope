package gary.backend.Service;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Set;

import org.apache.logging.log4j.message.SimpleMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import gary.backend.DTO.RegisterDto;
import gary.backend.Entity.User;
import gary.backend.Entity.UserVerification;
import gary.backend.Repository.UserRepository;
import gary.backend.Repository.UserVerificationRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserVerificationRepository userVerificationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender javaMailSender;

    @Value("${app.base-url}")
    private String baseUrl;

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
        newUser.setEnabled(false);
        newUser.setAuthorities(Set.of("ROLE_USER"));

        // Generate Verfication Token
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes); // generate a random 32bytes to fill in bytes[]
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString((bytes));

        // Store New User
        userRepository.save(newUser);

        // Store UserVerifcation Info
        UserVerification userVerification = new UserVerification();
        userVerification.setUser(newUser);
        userVerification.setVerificationId(token);
        userVerification.setCreatedAt(LocalDateTime.now());
        userVerificationRepository.save(userVerification);

        // Send Verificaiton Email to User Email
        sendingVerificationLink(email, token);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("You registed successfully! Please check your email to verify!");
    }

    public ResponseEntity<String> verify(String token) {

        UserVerification uv = userVerificationRepository.findByVerificationId(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        // if it doesn't exist
        if (uv == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("we didn't find the registred account");
        }

        // check if expired
        LocalDateTime create_at = uv.getCreatedAt();
        if (create_at.plusHours(24).isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The verification link is expired");
        }

        // check if user is already activate
        User unverfied_user = uv.getUser();
        if (unverfied_user.getEnabled()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This user is already activated");
        }

        unverfied_user.setEnabled(true);
        userRepository.save(unverfied_user);
        userVerificationRepository.delete(uv);

        return ResponseEntity.status(HttpStatus.OK).body("Your account is successfully activated!");
    }

    private void sendingVerificationLink(String to, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();
        String verified_url = baseUrl + "/api/auth/verify/" + token;
        msg.setTo(to);
        msg.setSubject("Verify your FilmScope accpunt");
        msg.setText("Please click the link to verify " + verified_url);

        javaMailSender.send(msg);
    }

}
