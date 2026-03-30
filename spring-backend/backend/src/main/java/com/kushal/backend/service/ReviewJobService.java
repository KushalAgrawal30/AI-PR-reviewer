package com.kushal.backend.service;

import com.kushal.backend.dto.ReviewpageDto.ReviewFindingDto;
import com.kushal.backend.dto.ReviewpageDto.ReviewJobDetailsDto;
import com.kushal.backend.dto.ReviewpageDto.ReviewJobListDto;
import com.kushal.backend.entity.ReviewJob;
import com.kushal.backend.repository.ReviewJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewJobService {

    private final ReviewJobRepository reviewJobRepository;

    public List<ReviewJobListDto> getAllReviewJobs(Long userId){

        List<ReviewJob> reviewJobs = reviewJobRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<ReviewJobListDto> reviewJobListDtoList = new ArrayList<>();

        for(ReviewJob job : reviewJobs){
            ReviewJobListDto reviewJobList = ReviewJobListDto.builder()
                    .id(job.getId())
                    .repositoryName(job.getRepositoryName())
                    .prNumber(job.getPrNumber())
                    .title(job.getTitle())
                    .summary(job.getSummary())
                    .status(job.getStatus())
                    .createdAt(job.getCreatedAt())
                    .updatedAt(job.getUpdatedAt())
                    .build();

            reviewJobListDtoList.add(reviewJobList);
        }

        return reviewJobListDtoList;

    }

    public ReviewJobDetailsDto getReviewJobById(Long id, Long userId){

        ReviewJob reviewJob = reviewJobRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("No jobs found"));

        List<ReviewFindingDto> findingDtos = reviewJob.getFindings().stream()
                        .map(reviewFinding -> ReviewFindingDto.builder()
                                .id(reviewFinding.getId())
                                .filePath(reviewFinding.getFilePath())
                                .lineNumber(reviewFinding.getLineNumber())
                                .severity(reviewFinding.getSeverity())
                                .category(reviewFinding.getCategory())
                                .title(reviewFinding.getTitle())
                                .description(reviewFinding.getDescription())
                                .suggestion(reviewFinding.getSuggestion())
                                .confidence(reviewFinding.getConfidence())
                                .build()).toList();


        return ReviewJobDetailsDto.builder()
                .id(reviewJob.getId())
                .repositoryName(reviewJob.getRepositoryName())
                .prNumber(reviewJob.getPrNumber())
                .title(reviewJob.getTitle())
                .description(reviewJob.getDescription())
                .summary(reviewJob.getSummary())
                .status(reviewJob.getStatus())
                .createdAt(reviewJob.getCreatedAt())
                .updatedAt(reviewJob.getUpdatedAt())
                .findings(findingDtos)
                .build();

    }

    public List<ReviewJobListDto> getReviewJobsByRepoName(String repositoryName, Long userId){
        List<ReviewJob> reviewJobList = reviewJobRepository.findByUserIdAndRepositoryNameOrderByCreatedAtDesc(userId, repositoryName);

        List<ReviewJobListDto> reviewJobListDtoList = new ArrayList<>();

        for(ReviewJob reviewJob : reviewJobList ){
            ReviewJobListDto reviewJobListDto = ReviewJobListDto.builder()
                    .id(reviewJob.getId())
                    .repositoryName(reviewJob.getRepositoryName())
                    .prNumber(reviewJob.getPrNumber())
                    .title(reviewJob.getTitle())
                    .summary(reviewJob.getSummary())
                    .status(reviewJob.getStatus())
                    .createdAt(reviewJob.getCreatedAt())
                    .updatedAt(reviewJob.getUpdatedAt())
                    .build();

            reviewJobListDtoList.add(reviewJobListDto);
        }

        return reviewJobListDtoList;

    }

}
