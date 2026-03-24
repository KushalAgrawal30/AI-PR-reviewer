package com.kushal.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateReviewRequestDto {
    private String repositoryName;
    private Integer prNumber;
    private String title;
    private String description;
    private List<ChangedFileDto> changedFiles;
}