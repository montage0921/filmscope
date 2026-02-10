package gary.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gary.backend.Entity.UserVerification;

@Repository
public interface UserVerificationRepository extends JpaRepository<UserVerification, Integer> {

}
