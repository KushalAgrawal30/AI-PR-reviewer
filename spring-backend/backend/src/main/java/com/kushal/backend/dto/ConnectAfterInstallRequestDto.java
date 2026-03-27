package com.kushal.backend.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConnectAfterInstallRequestDto {
    private Long userId;
    private Long installationId;
}