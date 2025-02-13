package com.example.studyhelp.upload.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RenameFolderRequest {
    private Long folderId;
    private String newName;
}
