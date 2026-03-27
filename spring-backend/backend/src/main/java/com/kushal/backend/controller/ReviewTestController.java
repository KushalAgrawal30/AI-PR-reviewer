package com.kushal.backend.controller;

import com.kushal.backend.dto.AiDto.AiReviewResponseDto;
import com.kushal.backend.dto.RequestDto.CreateReviewRequestDto;
import com.kushal.backend.service.AiReviewClientService;
import com.kushal.backend.service.ReviewOrchestrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/review/")
@RequiredArgsConstructor
public class ReviewTestController {

    private final AiReviewClientService aiReviewClientService;
    private final ReviewOrchestrationService reviewOrchestrationService;

    @PostMapping("/test")
    public ResponseEntity<AiReviewResponseDto> requestReview(@RequestBody CreateReviewRequestDto createReviewRequestDto){

        AiReviewResponseDto reviewResponseDto = reviewOrchestrationService.startReview(createReviewRequestDto);

        return ResponseEntity.ok().body(reviewResponseDto);

    }

}
