package com.example.studyhelp.exception;

import com.example.studyhelp.sign.response.ApiResponseWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 🔹 커스텀 예외 처리 (사용자 정의 예외)
     */
    @ExceptionHandler(CustomException.class)
    @ResponseBody
    public ResponseEntity<ApiResponseWrapper<Object>> handleCustomException(CustomException e) {
        return ResponseEntity
                .status(e.getStatusCode())
                .body(new ApiResponseWrapper<>(false, false, e.getMessage()));
    }

    /**
     * 🔹 인증 예외 처리 (401 Unauthorized)
     * - 사용자가 로그인하지 않았거나, 잘못된 토큰을 사용한 경우
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseBody
    public ResponseEntity<ApiResponseWrapper<Object>> handleAuthenticationException(AuthenticationException e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED) // 401 Unauthorized
                .body(new ApiResponseWrapper<>(false, false, "인증이 필요합니다. (로그인하세요)"));
    }

    /**
     * 🔹 권한 예외 처리 (403 Forbidden)
     * - 사용자가 로그인은 했지만, API를 사용할 권한이 없는 경우
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseBody
    public ResponseEntity<ApiResponseWrapper<Object>> handleAccessDeniedException(AccessDeniedException e) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN) // 403 Forbidden
                .body(new ApiResponseWrapper<>(false, false, "접근 권한이 없습니다."));
    }

    /**
     * 🔹 일반 예외 처리 (500 Internal Server Error)
     */
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity<ApiResponseWrapper<Object>> handleGeneralException(Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseWrapper<>(false, false, e.getMessage()));
    }
}
