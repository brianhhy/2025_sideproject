package com.example.studyhelp.exception.exceptions;

import com.example.studyhelp.exception.CustomException;

public class FileNotUploadException extends CustomException {
    public FileNotUploadException() {
        super("파일 저장 실패", 404);
    }
}