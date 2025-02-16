package com.example.studyhelp.summary.gpt;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ChatGptRequest {

    @JsonProperty("model") // JSON 요청의 "model" 필드와 매핑
    private String model;

    @JsonProperty("messages") // JSON 요청의 "messages" 필드와 매핑
    private List<Message> messages;

    @JsonProperty("max_tokens") // JSON 요청의 "max_tokens" 필드와 매핑
    private int maxTokens;

    public ChatGptRequest(String model, List<Message> messages, int maxTokens) {
        this.model = model;
        this.messages = messages;
        this.maxTokens = maxTokens;
    }

    public static class Message {
        @JsonProperty("role")
        private String role;

        @JsonProperty("content")
        private String content;

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() {
            return role;
        }

        public String getContent() {
            return content;
        }
    }
}
