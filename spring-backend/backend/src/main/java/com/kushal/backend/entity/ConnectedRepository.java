package com.kushal.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "connected_repositories")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConnectedRepository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long githubRepoId;

    @Column(nullable = false)
    private String repoName;

    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false, unique = true)
    private String fullName;

    @Column(nullable = false)
    private Long installationId;

    private Boolean active = true;

    private Boolean isPrivate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    public void onCreate(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if(this.active == null){
            this.active = true;
        }
    }

    @PreUpdate
    public void onUpdate(){
        this.updatedAt = LocalDateTime.now();
    }


}
