package com.kushal.backend.dto.ReviewpageDto;

import com.kushal.backend.entity.ReviewStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewJobDetailsDto {
    private Long id;
    private String repositoryName;
    private Integer prNumber;
    private String title;
    private String description;
    private String summary;
    private ReviewStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ReviewFindingDto> findings;
}