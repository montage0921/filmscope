package gary.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import gary.backend.Entity.Film;

public interface FilmRepository extends JpaRepository<Film, Integer> {

}
