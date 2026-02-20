package gary.backend.Entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data

@Entity
@Table(name = "screenings")
public class Screening {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "screening_id")
    private int screening_id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "show_id", referencedColumnName = "show_id")
    @ToString.Exclude
    private Show show;

    @Column(name = "start_date")
    private LocalDate start_date;

    @Column(name = "start_time")
    private LocalTime start_time;

    @Column(name = "ticket_url")
    private String ticket_url;

    @ManyToMany(mappedBy = "screenings")
    @JsonIgnoreProperties("screenings")
    @ToString.Exclude
    private Set<User> likedBy;
}
