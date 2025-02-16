package com.example.studyhelp.upload.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@AllArgsConstructor
@ToString
public class FolderDataResponseDto {
    private Long folderId;
    private String folderName;
    private List<FileInfo> files;
}

