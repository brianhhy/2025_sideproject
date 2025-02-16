package com.example.studyhelp.upload.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateFileRequest {
    private Long fileId;
    private MultipartFile file;
}

