package com.kushal.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangedFileDto {
    private String path;
    private String patch;
}