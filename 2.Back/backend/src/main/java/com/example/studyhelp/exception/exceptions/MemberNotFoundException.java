package com.example.studyhelp.exception.exceptions;

import com.example.studyhelp.exception.CustomException;

public class MemberNotFoundException extends CustomException {
    public MemberNotFoundException() {
        super("사용자를 찾을 수 없습니다.", 404);
    }
}
