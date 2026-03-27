package com.kushal.backend.dto.AiDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class AiReviewRequestDto {
    private String reviewJobId;
    private String repository;
    private Integer prNumber;
    private String title;
    private String description;
    private List<ChangedFileDto> changedFiles;
}