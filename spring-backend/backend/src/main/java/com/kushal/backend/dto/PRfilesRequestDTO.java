package com.kushal.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class PRfilesRequestDTO {
    private String repoFullName;
    private Long installationId;
    private int prNumberLong;
}
