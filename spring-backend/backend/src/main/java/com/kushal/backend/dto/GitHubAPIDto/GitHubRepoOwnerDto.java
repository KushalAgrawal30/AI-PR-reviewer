package com.kushal.backend.dto.GitHubAPIDto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitHubRepoOwnerDto {
    private String login;
}