package com.example.studyhelp.sign.defaultLogin;

import com.example.studyhelp.sign.dto.DefaultLoginRequest;
import com.example.studyhelp.sign.dto.DefaultSignUpRequest;
import com.example.studyhelp.sign.response.ApiResponseWrapper;
import com.example.studyhelp.sign.service.MemberService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/default")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponseWrapper<Boolean>> signUp(@RequestBody DefaultSignUpRequest defaultSignUpRequest) {
        boolean result = memberService.signUpDefaultMember(defaultSignUpRequest);
        return ResponseEntity.ok(new ApiResponseWrapper<>(result, result, "회원가입 성공"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseWrapper<Boolean>> login(@RequestBody DefaultLoginRequest request, HttpServletResponse response) {
        log.info("login request = {}",request);
        boolean result = memberService.loginDefaultMember(request, response);
        return ResponseEntity.ok(new ApiResponseWrapper<>(result, result, "로그인 성공"));
    }

}
