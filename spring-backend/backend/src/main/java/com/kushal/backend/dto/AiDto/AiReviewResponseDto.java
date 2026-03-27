package com.kushal.backend.dto.AiDto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiReviewResponseDto {
    private String reviewJobId;
    private String summary;
    private List<AiFindingResponseDto> findings;
}