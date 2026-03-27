package com.kushal.backend.dto.GitHubAPIDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GitHubRepositoryDto {

    @JsonProperty("id")
    private Long githubRepoId;

    private String name;

    @JsonProperty("full_name")
    private String fullName;

    private GitHubRepoOwnerDto owner;

    @JsonProperty("private")
    private Boolean isPrivate;


}
