package gary.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import gary.backend.Entity.ResetToken;
import java.util.List;
import java.util.Optional;

public interface ResetTokenRepository extends JpaRepository<ResetToken, Integer> {
    Optional<ResetToken> findByResetToken(String resetToken);
}
