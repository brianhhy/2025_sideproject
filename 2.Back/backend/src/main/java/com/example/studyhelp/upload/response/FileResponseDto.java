package com.example.studyhelp.upload.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FileResponseDto {
    private Long fileId;
    private String originalName;
    private LocalDateTime createdTime;

    public FileResponseDto(Long fileId, String originalName, LocalDateTime createdTime) {
        this.fileId = fileId;
        this.originalName = originalName;
        this.createdTime = createdTime;
    }
}
