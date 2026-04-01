package com.kushal.backend.service;

import com.kushal.backend.dto.AiDto.AiFindingResponseDto;
import com.kushal.backend.dto.AiDto.AiReviewRequestDto;
import com.kushal.backend.dto.AiDto.AiReviewResponseDto;
import com.kushal.backend.dto.AiDto.ChangedFileDto;
import com.kushal.backend.dto.RequestDto.CreateReviewRequestDto;
import com.kushal.backend.entity.*;
import com.kushal.backend.repository.ReviewFindingRepository;
import com.kushal.backend.repository.ReviewJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewOrchestrationService {

    private final ReviewJobRepository reviewJobRepository;
    private final AiReviewClientService aiReviewClientService;
    private final ReviewFindingRepository reviewFindingRepository;
    private final GitHubAppService gitHubAppService;
    private final ConnectedRepositoryService connectedRepositoryService;

    public ReviewJob startReview(CreateReviewRequestDto createReviewRequestDto, User user) {

        ReviewJob reviewJob = ReviewJob.builder()
                .repositoryName(createReviewRequestDto.getRepositoryName())
                .prNumber(createReviewRequestDto.getPrNumber())
                .title(createReviewRequestDto.getTitle())
                .description(createReviewRequestDto.getDescription())
                .status(ReviewStatus.PENDING)
                .user(user)
                .build();

        reviewJob = reviewJobRepository.save(reviewJob);
        return reviewJob;

    }

    public void processQueuedReviewJob(Long reviewJobId){
        ReviewJob reviewJob = reviewJobRepository.findById(reviewJobId)
                .orElseThrow(() -> new RuntimeException("Review Job not found"));

        if(reviewJob.getStatus() != ReviewStatus.PENDING){
            return;
        }

        reviewJob.setStatus(ReviewStatus.PROCESSING);
        reviewJobRepository.save(reviewJob);

        try {

            ConnectedRepository connectedRepository = connectedRepositoryService.getByFullName(reviewJob.getRepositoryName());
            Long installationId = connectedRepository.getInstallationId();

            List<ChangedFileDto> changedFiles = gitHubAppService.getPullRequestFiles(installationId, reviewJob.getRepositoryName(), reviewJob.getPrNumber());

            AiReviewRequestDto aiReviewRequest = AiReviewRequestDto.builder()
                    .reviewJobId(reviewJob.getId().toString())
                    .repository(reviewJob.getRepositoryName())
                    .prNumber(reviewJob.getPrNumber())
                    .title(reviewJob.getTitle())
                    .description(reviewJob.getDescription())
                    .changedFiles(changedFiles)
                    .build();

            if (changedFiles.isEmpty()) {
                reviewJob.setSummary("No reviewable changed files found for this pull request.");
                reviewJob.setStatus(ReviewStatus.COMPLETED);
                reviewJobRepository.save(reviewJob);
                return;
            }

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

        }catch (Exception e){
            reviewJob.setStatus(ReviewStatus.FAILED);
            reviewJobRepository.save(reviewJob);
            throw new RuntimeException("Review orchestration failed", e);
        }

    }
}
