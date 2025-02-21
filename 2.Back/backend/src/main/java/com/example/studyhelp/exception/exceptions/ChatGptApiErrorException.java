package com.example.studyhelp.exception.exceptions;

import com.example.studyhelp.exception.CustomException;

public class ChatGptApiErrorException extends CustomException {
    public ChatGptApiErrorException() {
        super("ChatGpt Api 요청 오류", 404);
    }
}