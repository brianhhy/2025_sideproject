package com.example.studyhelp.summary.gpt;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class GptPromptRequest {
    @JsonProperty("prompt")
    private String prompt;
    @JsonProperty("type")
    private String type;
}