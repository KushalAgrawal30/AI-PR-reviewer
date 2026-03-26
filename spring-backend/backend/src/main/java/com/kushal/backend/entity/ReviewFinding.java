package com.kushal.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_findings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewFinding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filePath;

    private Integer lineNumber;

    private String severity;

    private String category;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String suggestion;

    private Double confidence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_job_id", nullable = false)
    private ReviewJob reviewJob;
}