package com.example.studyhelp.summary.gpt;

import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString
public class ChatGptResponse {
    private List<Choice> choices;

    public List<Choice> getChoices() {
        return choices;
    }

    public static class Choice {
        private int index;
        private Message message;

        public int getIndex() {
            return index;
        }

        public Message getMessage() {
            return message;
        }
    }

    public static class Message {
        private String role;
        private String content;

        public String getRole() {
            return role;
        }

        public String getContent() {
            return content;
        }
    }
}