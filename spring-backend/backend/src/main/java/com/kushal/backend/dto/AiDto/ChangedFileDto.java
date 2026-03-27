package com.kushal.backend.dto.AiDto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangedFileDto {
    private String path;
    private String patch;
}