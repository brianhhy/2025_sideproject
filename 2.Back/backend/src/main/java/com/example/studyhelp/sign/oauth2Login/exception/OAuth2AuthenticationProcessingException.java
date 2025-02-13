package com.example.studyhelp.sign.oauth2Login.exception;

import org.springframework.security.core.AuthenticationException;

public class OAuth2AuthenticationProcessingException extends AuthenticationException {
    public OAuth2AuthenticationProcessingException(String msg) {
        super(msg);
    }
}
