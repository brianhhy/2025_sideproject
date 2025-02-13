package com.example.studyhelp.exception.exceptions;

import com.example.studyhelp.exception.CustomException;

public class FolderNotFoundException extends CustomException {
    public FolderNotFoundException() {
        super("폴더를 찾을 수 없습니다.", 404);
    }
}