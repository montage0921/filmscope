package gary.backend.Entity;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "shows")
public class Show {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "show_id")
    private int show_id;

    @ManyToOne
    @JoinColumn(name = "theatre_id", referencedColumnName = "theatre_id")
    private Theatre theatre;

    @Column(name = "show_name")
    private String show_name;

    @Column(name = "special")
    private String special;

    @Column(name = "qa_with")
    private String qa_with;

    @OneToMany(mappedBy = "show")
    private List<Screening> screenings;

    @ManyToMany
    @JoinTable(
        name = "show_films",
        joinColumns =  @JoinColumn(name = "show_id"),
        inverseJoinColumns = @JoinColumn(name = "film_id")
    )
    @JsonIgnoreProperties("shows")
    private Set<Film> films;
}
