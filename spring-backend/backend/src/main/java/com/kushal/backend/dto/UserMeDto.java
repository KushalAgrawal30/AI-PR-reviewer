package com.kushal.backend.dto;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserMeDto {
    private Long id;
    private String githubLogin;
    private String name;
    private String avatarUrl;
}
