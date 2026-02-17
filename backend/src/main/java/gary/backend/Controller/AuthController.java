package gary.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import gary.backend.DTO.LoginDto;
import gary.backend.DTO.LoginResponseDto;
import gary.backend.DTO.RegisterDto;
import gary.backend.DTO.ResetDto;
import gary.backend.Service.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@AllArgsConstructor

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:3000", "https://filmscope-lq18.onrender.com", "http://192.168.1.231:3000",
        "https://filmscope.onrender.com" })
public class AuthController {
    private final AuthService authService;

    @PostMapping("register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterDto registerDto) {
        return authService.register(registerDto);
    }

    @GetMapping("/verify/{token}")
    public ResponseEntity<String> getVerify(@PathVariable String token) {

        return authService.verify(token);
    }

    @PostMapping("login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        return authService.login(loginDto);
    }

    @PostMapping("/forgetpassword")
    public ResponseEntity<String> forgetPassword(@RequestParam String email) {
        return authService.sendResetLink(email);
    }

    @GetMapping("/reset/{token}")
    public ResponseEntity<Void> clickResetLink(@PathVariable String token) {
        return authService.clickResetLink(token);
    }

    // it returned a masked email to fonrtend when loading reset page
    @GetMapping("/reset-info")
    public ResponseEntity<?> resetInfo(@RequestParam String token) {
        return authService.resetInfo(token);
    }

    @PostMapping("/reset")
    public ResponseEntity<String> postMethodName(@RequestBody ResetDto resetDto) {
        return authService.reset(resetDto);
    }

}
