package com.example.studyhelp.summary.gpt;

import com.example.studyhelp.sign.response.ApiResponseWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/user/gpt")
public class GptController {

    private final ChatGptService gptService;

    @PostMapping("/gptRequest")
    public ResponseEntity<ApiResponseWrapper<String>> gptRequest(@RequestBody GptPromptRequest request) {
        log.info("gptRequest 요청 데이터: {}", request);

        String result = gptService.chat(request.getPrompt(),request.getType());
        return ResponseEntity.ok(new ApiResponseWrapper<>(result, true, "요청 성공"));
    }

}
