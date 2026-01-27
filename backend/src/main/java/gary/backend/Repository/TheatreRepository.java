package gary.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import gary.backend.Entity.Theatre;

public interface TheatreRepository extends JpaRepository<Theatre, Integer> {

}
