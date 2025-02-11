package com.example.studyhelp.exception.exceptions;

import com.example.studyhelp.exception.CustomException;

public class FileNotFoundException extends CustomException {
    public FileNotFoundException() {
        super("파일 찾기 실패", 404);
    }
}