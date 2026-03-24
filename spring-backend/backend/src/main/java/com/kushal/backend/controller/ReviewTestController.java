package com.kushal.backend.controller;

import com.kushal.backend.dto.AiReviewRequestDto;
import com.kushal.backend.dto.AiReviewResponseDto;
import com.kushal.backend.dto.CreateReviewRequestDto;
import com.kushal.backend.service.AiReviewClientService;
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

    @PostMapping("/test")
    public ResponseEntity<AiReviewResponseDto> requestReview(@RequestBody CreateReviewRequestDto createReviewRequestDto){
        AiReviewRequestDto aiReviewRequestDto = AiReviewRequestDto.builder()
                .reviewJobId("1")
                .repository(createReviewRequestDto.getRepositoryName())
                .prNumber(createReviewRequestDto.getPrNumber())
                .title(createReviewRequestDto.getTitle())
                .description(createReviewRequestDto.getDescription())
                .changedFiles(createReviewRequestDto.getChangedFiles())
                .build();

        AiReviewResponseDto reviewResponseDto = aiReviewClientService.requestReview(aiReviewRequestDto);

        return ResponseEntity.ok().body(reviewResponseDto);



    }

}
