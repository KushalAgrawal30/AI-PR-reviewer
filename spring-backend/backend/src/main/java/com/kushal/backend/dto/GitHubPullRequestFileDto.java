package com.kushal.backend.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitHubPullRequestFileDto {
    private String filename;
    private String patch;
}
