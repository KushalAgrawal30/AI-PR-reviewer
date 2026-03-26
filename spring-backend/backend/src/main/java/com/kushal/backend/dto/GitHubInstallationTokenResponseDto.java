package com.kushal.backend.dto;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GitHubInstallationTokenResponseDto {
    private String token;
}
