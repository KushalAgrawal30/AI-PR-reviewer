package com.kushal.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateReviewRequestDto {
    private String repositoryName;
    private Integer prNumber;
    private String title;
    private String description;
    private List<ChangedFileDto> changedFiles;
}