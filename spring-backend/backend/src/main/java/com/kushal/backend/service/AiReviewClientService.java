package com.kushal.backend.service;

import com.kushal.backend.dto.AiReviewRequestDto;
import com.kushal.backend.dto.AiReviewResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AiReviewClientService {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceURL;

    public AiReviewResponseDto requestReview(AiReviewRequestDto aiReviewRequestDto){
        AiReviewResponseDto aiReviewResponseDto = restTemplate.postForObject(aiServiceURL, aiReviewRequestDto, AiReviewResponseDto.class);

        if (aiReviewResponseDto == null) {
            throw new RuntimeException("AI service returned null response");
        }

        return aiReviewResponseDto;
    }

}
