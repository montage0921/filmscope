package gary.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import gary.backend.Entity.Film;

public interface FilmRepository extends JpaRepository<Film, Integer> {
    @Query(
        value = "select film_id, title, director, backdrop, string_agg(g.genre, ', ') AS genres " +
        " from films f " +
        "natural join genre_film gf " +  
        "natural join genres g  " +
        " group by f.title, f.film_id,  f.director, f.backdrop",
        nativeQuery = true
    )
    List<Object[]> findAllFilmDto();
}
