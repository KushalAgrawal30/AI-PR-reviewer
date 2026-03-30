package com.kushal.backend.service;

import com.kushal.backend.dto.AiDto.AiFindingResponseDto;
import com.kushal.backend.dto.AiDto.AiReviewRequestDto;
import com.kushal.backend.dto.AiDto.AiReviewResponseDto;
import com.kushal.backend.dto.RequestDto.CreateReviewRequestDto;
import com.kushal.backend.entity.ReviewFinding;
import com.kushal.backend.entity.ReviewJob;
import com.kushal.backend.entity.ReviewStatus;
import com.kushal.backend.entity.User;
import com.kushal.backend.repository.ReviewFindingRepository;
import com.kushal.backend.repository.ReviewJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewOrchestrationService {

    private final ReviewJobRepository reviewJobRepository;
    private final AiReviewClientService aiReviewClientService;
    private final ReviewFindingRepository reviewFindingRepository;

    public AiReviewResponseDto startReview(CreateReviewRequestDto createReviewRequestDto, User user){

        ReviewJob reviewJob = ReviewJob.builder()
                .repositoryName(createReviewRequestDto.getRepositoryName())
                .prNumber(createReviewRequestDto.getPrNumber())
                .title(createReviewRequestDto.getTitle())
                .description(createReviewRequestDto.getDescription())
                .status(ReviewStatus.PROCESSING)
                .user(user)
                .build();

        reviewJob = reviewJobRepository.save(reviewJob);

        try {

            AiReviewRequestDto aiReviewRequest = AiReviewRequestDto.builder()
                    .reviewJobId(reviewJob.getId().toString())
                    .repository(reviewJob.getRepositoryName())
                    .prNumber(reviewJob.getPrNumber())
                    .title(reviewJob.getTitle())
                    .description(reviewJob.getDescription())
                    .changedFiles(createReviewRequestDto.getChangedFiles())
                    .build();

            AiReviewResponseDto aiReviewResponse = aiReviewClientService.requestReview(aiReviewRequest);

            reviewJob.setSummary(aiReviewResponse.getSummary());

            if (aiReviewResponse.getFindings() != null) {
                for (AiFindingResponseDto findingResponse : aiReviewResponse.getFindings()) {
                    ReviewFinding reviewFinding = ReviewFinding.builder()
                            .filePath(findingResponse.getFilePath())
                            .lineNumber(findingResponse.getLine())
                            .severity(findingResponse.getSeverity())
                            .category(findingResponse.getCategory())
                            .title(findingResponse.getTitle())
                            .description(findingResponse.getDescription())
                            .suggestion(findingResponse.getSuggestion())
                            .confidence(findingResponse.getConfidence())
                            .reviewJob(reviewJob)
                            .build();

                    reviewFindingRepository.save(reviewFinding);

                }
            }

            reviewJob.setStatus(ReviewStatus.COMPLETED);
            reviewJobRepository.save(reviewJob);

            return aiReviewResponse;

        }catch (Exception e){
            reviewJob.setStatus(ReviewStatus.FAILED);
            reviewJobRepository.save(reviewJob);
            throw new RuntimeException("Review orchestration failed", e);
        }


    }

}
