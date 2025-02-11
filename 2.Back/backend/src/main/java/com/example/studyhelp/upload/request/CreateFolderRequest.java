package com.example.studyhelp.upload.request;

import lombok.Builder;
import lombok.Data;

@Data
public class CreateFolderRequest {
    private Long parentFolderId;
    private String folderName;

    @Builder
    public CreateFolderRequest(Long parentFolderId, String folderName) {
        this.parentFolderId = parentFolderId;
        this.folderName = folderName;
    }
}
