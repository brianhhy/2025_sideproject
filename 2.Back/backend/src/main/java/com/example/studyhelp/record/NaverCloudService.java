package com.example.studyhelp.record;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Slf4j
@RequiredArgsConstructor
@Service
public class NaverCloudService {
    @Value("${clova.speech.api.client-id}")
    private String clientId;

    @Value("${clova.speech.api.client-secret}")
    private String clientSecret;

    private static final String CLOVA_SPEECH_API_URL = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor";

    public String recognizeSpeech(MultipartFile file) {
        log.info("clientId = {}, clientSecret = {}", clientId, clientSecret);
        // 🚀 1. HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set("X-NCP-APIGW-API-KEY-ID", clientId);
            headers.set("X-NCP-APIGW-API-KEY", clientSecret);

        // 🚀 2. HTTP 요청 생성
        HttpEntity<byte[]> requestEntity;
        try {
            requestEntity = new HttpEntity<>(file.getBytes(), headers);
        } catch (Exception e) {
            log.error("파일 변환 실패", e);
            return "음성 인식 실패: " + e.getMessage();
        }

        // 🚀 3. REST API 요청 보내기
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    CLOVA_SPEECH_API_URL,
                    HttpMethod.POST,


                    requestEntity,
                    String.class
            );
            // 응답 상태 코드 확인 및 결과 반환
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            } else {
                return "음성 인식 실패: 응답 상태 코드 " + response.getStatusCode();
            }
        } catch (Exception e) {
            log.error("음성 인식 API 호출 실패", e);
            return "음성 인식 실패: " + e.getMessage();
        }
    }
}