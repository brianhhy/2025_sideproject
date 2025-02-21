package com.example.studyhelp.upload.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadFileRequest {
    private String fileName;
    private Long folderId;
    private MultipartFile file;
}

