package com.example.studyhelp.sign.response;

import lombok.Data;

@Data
public class ApiResponseWrapper<T> {
    private T data;
    private boolean success;
    private String message;

    public ApiResponseWrapper(T data, boolean success, String message) {
        this.data = data;
        this.success = success;
        this.message = message;
    }
}
