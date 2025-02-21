package com.example.studyhelp.summary.gpt;
import com.example.studyhelp.exception.exceptions.ChatGptApiErrorException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatGptService {

    private final RestTemplate restTemplate;
    @Value("${openai.secret}")
    private String apiKey;
    @Value("${openai.model}")
    private String model;
    @Value("${openai.endpoint}")
    private String apiEndpoint;

    private static final String SYSTEM_PROMPT =
            "다음 내용을 핵심만 남기고 요약해줘:\n\n";

    // 메시지 입력받고 챗gpt의 응답을 리턴하는 메서드
    // ✅ ChatGPT API 요청을 보내고 응답을 반환하는 메서드
    public String chat(String message) {

        // 🚀 1. HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("Authorization", "Bearer " + apiKey);

        // 🚀 2. 요청 JSON 데이터 구성
        JSONObject messageUser = new JSONObject();
        messageUser.put("role", "user");
        messageUser.put("content", SYSTEM_PROMPT + message);

        JSONArray messages = new JSONArray();
        messages.add(messageUser);

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", model);
        requestBody.put("messages", messages);

        // 🚀 3. HTTP 요청 생성
        HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);

        try {
            // REST API 호출을 통해 응답 받기
            ResponseEntity<String> response = restTemplate.postForEntity(apiEndpoint, request, String.class);

            // 응답 상태 코드 확인
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                calculateTokenUsageAndCost(response);
                String result = extractChatGptReply(response);
                return result;  // 성공적인 응답 반환
            } else {
                throw new ChatGptApiErrorException();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new ChatGptApiErrorException();
        }
    }

    // ✅ ChatGPT API 응답에서 총 토큰 수 및 비용 계산
    private void calculateTokenUsageAndCost(ResponseEntity<String> response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            int promptTokens = rootNode.path("usage").path("prompt_tokens").asInt();
            int completionTokens = rootNode.path("usage").path("completion_tokens").asInt();
            int totalTokens = rootNode.path("usage").path("total_tokens").asInt();

            // ✅ 비용 계산 (GPT-4o 요금 기준)
            double inputCost = (promptTokens / 1_000_000.0) * 2.50;
            double outputCost = (completionTokens / 1_000_000.0) * 10.00;
            double totalCost = inputCost + outputCost;

            log.info("💰 총 사용 토큰: {}", totalTokens);
            log.info("📥 입력 토큰: {} (비용: ${})", promptTokens, String.format("%.6f", inputCost));
            log.info("📤 출력 토큰: {} (비용: ${})", completionTokens, String.format("%.6f", outputCost));
            log.info("💲 예상 비용 (USD): ${}", String.format("%.6f", totalCost));
        } catch (Exception e) {
            log.error("🚨 JSON 파싱 오류 (토큰 계산 실패): {}", e.getMessage());
        }
    }

    private String extractChatGptReply(ResponseEntity<String> response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            JsonNode choices = rootNode.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                return choices.get(0).path("message").path("content").asText();
            } else {
                return "응답 없음";
            }
        } catch (Exception e) {
            return "🚨 JSON 파싱 오류: " + e.getMessage();
        }
    }


}