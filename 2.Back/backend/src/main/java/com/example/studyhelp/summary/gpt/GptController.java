package com.example.studyhelp.summary.gpt;

import com.example.studyhelp.exception.exceptions.MemberNotFoundException;
import com.example.studyhelp.sign.entity.Member;
import com.example.studyhelp.sign.response.ApiResponseWrapper;
import com.example.studyhelp.upload.request.UpdateFileRequest;
import com.google.protobuf.Api;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import reactor.core.publisher.Mono;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/user/summary")
public class GptController {

    private final ChatGptService gptService;

    @PostMapping("/getRequest")
    public ResponseEntity<ApiResponseWrapper<String>> updateFile(@RequestBody GptPromptRequest request) {
        log.info("📩 요청 데이터: {}", request);

        String result = gptService.chat(request.getPrompt());
        return ResponseEntity.ok(new ApiResponseWrapper<>(result, true, "요청 성공"));
    }

}
