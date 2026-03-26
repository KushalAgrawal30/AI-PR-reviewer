package com.kushal.backend.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewFindingDto {
    private Long id;
    private String filePath;
    private Integer lineNumber;
    private String severity;
    private String category;
    private String title;
    private String description;
    private String suggestion;
    private Double confidence;
}