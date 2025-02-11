package com.example.studyhelp.sign.controller;

import com.example.studyhelp.sign.entity.Member;
import com.example.studyhelp.sign.service.MemberService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final MemberService memberService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("UserDetails = {}", userDetails);

        // Spring Security가 자동으로 인증되지 않은 요청을 차단하므로, userDetails가 null일 가능성은 없음.
        Member member = memberService.findByUserName(userDetails.getUsername());

        // 필요한 사용자 정보만 반환
        return ResponseEntity.ok(new UserResponse(member.getNickname(), member.getEmail(), member.getProvider()));
    }


    // 사용자 응답 데이터를 위한 클래스 정의
    @Data
    private static class UserResponse {
        private final String name;
        private final String email;
        private final String provider;

        public UserResponse(String name, String email, String provider) {
            this.name = name;
            this.email = email;
            this.provider = provider;
        }
    }
}
