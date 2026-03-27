package com.kushal.backend.dto.RequestDto;

import lombok.*;

@Data
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestRepoConnectDTO {
    private Long userId;
    private Long githubRepoId;
    private String repoName;
    private String ownerName;
    private String fullName;
    private Long installationId;
    private Boolean isPrivate;
}
