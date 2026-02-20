package gary.backend.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "films")
public class Film {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "film_id")
    private int film_id;

    @Column(name = "title")
    private String title;

    @Column(name = "year")
    private int year;

    @Column(name = "director")
    private String director;

    @Column(name = "runtime")
    private Integer runtime;

    @Column(name = "tconst")
    private String tconst;

    @Column(name = "poster")
    private String poster;

    @Column(name = "backdrop")
    private String backdrop;

    @Column(name = "casts")
    private String casts;

    @Column(name = "countries")
    private String countries;

    @Column(name = "original_title")
    private String original_title;

    @Column(name = "languages")
    private String languages;

    @Column(name = "plot", columnDefinition = "TEXT")
    private String plot;

    @ManyToMany(mappedBy = "films")
    @JsonIgnoreProperties("films")
    @ToString.Exclude
    private List<Show> shows;

    @ManyToMany
    @JoinTable(name = "genre_film", joinColumns = @JoinColumn(name = "film_id"), inverseJoinColumns = @JoinColumn(name = "genre_id"))
    @ToString.Exclude
    private List<Genre> genres;

    @ManyToMany(mappedBy = "films")
    @JsonIgnoreProperties("films")
    @ToString.Exclude
    private List<User> likedBy;

}
