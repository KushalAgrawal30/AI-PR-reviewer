package com.kushal.backend.controller;


import com.kushal.backend.dto.ReviewpageDto.ReviewJobDetailsDto;
import com.kushal.backend.dto.ReviewpageDto.ReviewJobListDto;
import com.kushal.backend.entity.User;
import com.kushal.backend.service.ReviewJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review-jobs")
@RequiredArgsConstructor
public class ReviewJobController {

    private final ReviewJobService reviewJobService;

    @GetMapping
    public ResponseEntity<List<ReviewJobListDto>> getAllReviewJobs(Authentication authentication){
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return ResponseEntity.status(401).build();
        }
        List<ReviewJobListDto> reviewJobList =  reviewJobService.getAllReviewJobs(user.getId());

        return ResponseEntity.ok().body(reviewJobList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewJobDetailsDto> getReviewJobsById(@PathVariable Long id, Authentication authentication){
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return ResponseEntity.status(401).build();
        }
        ReviewJobDetailsDto reviewJobDetails = reviewJobService.getReviewJobById(id, user.getId());

        return ResponseEntity.ok().body(reviewJobDetails);
    }

    @GetMapping("/repository")
    public ResponseEntity<List<ReviewJobListDto>> getReviewJobsByRepository(
            @RequestParam String repositoryName,
            Authentication authentication
    ){
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(reviewJobService.getReviewJobsByRepoName(repositoryName, user.getId()));
    }

}
