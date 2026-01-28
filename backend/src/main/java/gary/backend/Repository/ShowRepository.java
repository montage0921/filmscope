package gary.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import gary.backend.Entity.Show;

public interface ShowRepository extends JpaRepository<Show, Integer>{
    @Query(value = "SELECT DISTINCT ON(show_name)" + 
                    "show_id, show_name, t.name AS theatre, f.title AS film_title, s.start_date "  + 
                    "FROM shows " + 
                    "NATURAL JOIN theatre t " + 
                    "NATURAL JOIN screenings s " + 
                    "NATURAL JOIN show_films sf " + 
                    "JOIN films f ON sf.film_id = f.film_id " + 
                    "ORDER BY show_name, s.start_date asc ",
                    nativeQuery = true)
    List<Object[]> findShowDescription();

}
