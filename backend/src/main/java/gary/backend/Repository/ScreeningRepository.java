package gary.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import gary.backend.Entity.Screening;

public interface ScreeningRepository extends JpaRepository<Screening, Integer>{

}
