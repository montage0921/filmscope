package gary.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import gary.backend.Entity.Genre;

public interface GenreRepository extends JpaRepository<Genre, Integer> {

}
