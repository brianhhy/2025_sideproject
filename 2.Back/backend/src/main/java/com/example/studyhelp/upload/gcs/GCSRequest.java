package com.example.studyhelp.upload.gcs;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class GCSRequest {
    private String name;
    private MultipartFile file;
}

