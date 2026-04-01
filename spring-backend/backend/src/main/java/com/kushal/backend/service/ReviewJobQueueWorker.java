package com.kushal.backend.service;

import com.kushal.backend.entity.ReviewJob;
import com.kushal.backend.entity.ReviewStatus;
import com.kushal.backend.repository.ReviewJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewJobQueueWorker {

    private final ReviewJobRepository reviewJobRepository;
    private final ReviewOrchestrationService reviewOrchestrationService;

    @Scheduled(fixedDelay = 5000)
    public void processQueuedReviewJob(){

        Optional<ReviewJob> pendingJob = reviewJobRepository.findFirstByStatusOrderByCreatedAtAsc(ReviewStatus.PENDING);

        if(pendingJob.isEmpty()){
            return;
        }

        ReviewJob reviewJob = pendingJob.get();
        System.out.println("Found a pending job. Repo Name: " + reviewJob.getRepositoryName() + "Job Id: " + reviewJob.getId() );

        try {
            reviewOrchestrationService.processQueuedReviewJob(reviewJob.getId());
        }catch (Exception e){
            System.out.println("Failed to process review job: " + reviewJob.getId());
        }

    }

}
