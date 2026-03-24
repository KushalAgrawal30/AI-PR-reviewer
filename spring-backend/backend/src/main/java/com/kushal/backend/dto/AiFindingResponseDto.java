package com.kushal.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiFindingResponseDto {
    private String filePath;
    private Integer line;
    private String severity;
    private String category;
    private String title;
    private String description;
    private String suggestion;
    private Double confidence;
}