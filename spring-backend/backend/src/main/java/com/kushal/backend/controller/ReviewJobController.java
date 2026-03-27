package com.kushal.backend.controller;


import com.kushal.backend.dto.ReviewpageDto.ReviewJobDetailsDto;
import com.kushal.backend.dto.ReviewpageDto.ReviewJobListDto;
import com.kushal.backend.service.ReviewJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/review-jobs")
@RequiredArgsConstructor
public class ReviewJobController {

    private final ReviewJobService reviewJobService;

    @GetMapping
    public ResponseEntity<List<ReviewJobListDto>> getAllReviewJobs(){

        List<ReviewJobListDto> reviewJobList =  reviewJobService.getAllReviewJobs();

        return ResponseEntity.ok().body(reviewJobList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewJobDetailsDto> getReviewJobsById(@PathVariable Long id){
        ReviewJobDetailsDto reviewJobDetails = reviewJobService.getReviewJobById(id);

        return ResponseEntity.ok().body(reviewJobDetails);
    }

}
