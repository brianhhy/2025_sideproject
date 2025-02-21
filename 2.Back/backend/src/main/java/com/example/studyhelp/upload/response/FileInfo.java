package com.example.studyhelp.upload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@ToString
public class FileInfo{
    private Long fileId;
    private String fileName;
    private LocalDateTime createdTime;
}
