package com.example.studyhelp.sign.response.responsecode;

public enum SuccessCode {
    SELECT_SUCCESS("200", "성공적으로 요청 처리되었습니다.");
    private final String status;
    private final String message;

    SuccessCode(String status, String message) {
        this.status = status;
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}