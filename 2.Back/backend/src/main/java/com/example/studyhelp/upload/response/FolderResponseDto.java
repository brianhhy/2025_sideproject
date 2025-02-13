package com.example.studyhelp.upload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
@AllArgsConstructor
public class FolderResponseDto {
    private Long folderId;
    private String folderName;
    private List<String> fileNames; // 최대 3개의 파일(폴더) original 이름
}