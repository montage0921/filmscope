package gary.backend.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import gary.backend.DTO.LoginDto;
import gary.backend.DTO.RegisterDto;
import gary.backend.DTO.ResetDto;
import gary.backend.Entity.ResetToken;
import gary.backend.Entity.User;
import gary.backend.Entity.UserVerification;
import gary.backend.Repository.ResetTokenRepository;
import gary.backend.Repository.UserRepository;
import gary.backend.Repository.UserVerificationRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserVerificationRepository userVerificationRepository;
    private final ResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final JavaMailSender javaMailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.frontend-url}")
    private String frontEndUrl;

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
        String token = generateToken();

        // Store New User
        userRepository.save(newUser);

        // Store UserVerifcation Info
        UserVerification userVerification = new UserVerification();
        userVerification.setUser(newUser);
        userVerification.setVerificationId(token);
        userVerification.setCreatedAt(LocalDateTime.now());
        userVerificationRepository.save(userVerification);

        String verificaiton_url = baseUrl + "/api/auth/verify/" + token;

        // Send Verificaiton Email to User Email
        sendLinkToEmail(email, verificaiton_url, "Please Verify Your FilmScope Account",
                "Please click the link to verify");

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

    public ResponseEntity<String> login(LoginDto loginDto) {
        String email = loginDto.getEmail();
        String password = loginDto.getPassword();
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // check if email exists
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No account accocaited with this email: " + email);
        }

        User user = optionalUser.get();

        // check if password is correct
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Password is wrong");
        }

        // check if the account is activated
        if (!user.getEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is not activated");
        }

        // All good! generate JWT!
        long expiry = 36000L; // 10 hours in seconds
        Instant now = Instant.now();

        // get all roles
        String scopes = user.getAuthorities().stream()
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("filmscope")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(user.getEmail())
                .claim("userId", user.getUser_id())
                .claim("scope", scopes)
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return ResponseEntity.status(HttpStatus.OK).body(token);

    }

    public ResponseEntity<String> sendResetLink(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("This email wasn't registred yet");
        }

        User user = userOptional.get();
        // 1 user map to 1 resettoken, so this relationship may already exist when we
        // click send link
        ResetToken resetToken = resetTokenRepository.findById(user.getUser_id()).orElseGet(() -> new ResetToken());

        // generate token
        String token = generateToken();

        // save token to database
        resetToken.setUser(user);
        resetToken.setResetToken(token);
        resetToken.setCreatedAt(LocalDateTime.now());
        resetTokenRepository.save(resetToken);

        // send email
        String reset_url = baseUrl + "/api/auth/reset/" + token;
        sendLinkToEmail(user.getEmail(), reset_url, "Please Reset Your Password",
                "Please click the link to reset your password");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("You reset link is sent");
    }

    public ResponseEntity<Void> clickResetLink(String token) {
        Optional<ResetToken> rtOptional = resetTokenRepository.findByResetToken(token);

        // if it doesn't exist
        if (rtOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        ResetToken rt = rtOptional.get();

        // check if expired
        LocalDateTime create_at = rt.getCreatedAt();
        if (create_at.plusHours(24).isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        return ResponseEntity.status(302)
                .header("Location", frontEndUrl + "/reset-password?token=" + rt.getResetToken()).build();
    }

    // return {"maskedEmail": garyshi****@gmail.com}
    public ResponseEntity<?> resetInfo(String token) {
        Optional<ResetToken> rtOptional = resetTokenRepository.findByResetToken(token);
        if (rtOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        ResetToken resetToken = rtOptional.get();
        if (resetToken.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String email = resetToken.getUser().getEmail();

        // masked email
        String maskedEmail = maskEmail(email);

        return ResponseEntity.status(200).body(java.util.Map.of("maskedEmail", maskedEmail));

    }

    public ResponseEntity<String> reset(ResetDto resetDto) {
        String token = resetDto.getToken();
        String newPassword = resetDto.getPassword();

        Optional<ResetToken> rtOptional = resetTokenRepository.findByResetToken(token);

        if (rtOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("This reset operation is invalid");
        }

        ResetToken resetToken = rtOptional.get();
        if (resetToken.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This reset link is expired");
        }

        User user = rtOptional.get().getUser();

        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        userRepository.save(user);
        resetTokenRepository.delete(resetToken);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Your password is reset! Please login again");
    }

    private String generateToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes); // generate a random 32bytes to fill in bytes[]
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString((bytes));
        return token;
    }

    private void sendLinkToEmail(String to, String url, String title, String content) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(title);
        msg.setText(content + "\n" + url);
        javaMailSender.send(msg);
    }

    private String maskEmail(String email) {
        int at = email.indexOf("@");
        if (at <= 1)
            return "***" + email.substring(at);
        String name = email.substring(0, at);
        String domain = email.substring(at);
        String shown = name.substring(0, Math.min(2, name.length()));
        return shown + "***" + domain;
    }

}
