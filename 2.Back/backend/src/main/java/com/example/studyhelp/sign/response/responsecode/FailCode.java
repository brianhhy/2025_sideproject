package com.example.studyhelp.sign.response.responsecode;

public enum FailCode {
    BAD_REQUEST("400", "잘못된 요청입니다."),
    UNAUTHORIZED("401", "인증되지 않은 사용자입니다."),
    FORBIDDEN("403", "접근 권한이 없습니다."),
    NOT_FOUND("404", "리소스를 찾을 수 없습니다."),
    INTERNAL_SERVER_ERROR("500", "서버 내부 오류가 발생했습니다."),
    SERVICE_UNAVAILABLE("503", "서비스를 사용할 수 없습니다.");

    private final String status;
    private final String message;

    FailCode(String status, String message) {
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