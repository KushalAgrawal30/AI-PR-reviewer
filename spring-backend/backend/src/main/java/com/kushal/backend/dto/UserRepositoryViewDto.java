package com.kushal.backend.dto;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRepositoryViewDto {
    private Long githubRepoId;
    private String name;
    private String fullName;
    private String ownerName;
    private Boolean isPrivate;
    private Long installationId;
    private Boolean connected;
}
