package com.example.studyhelp.sign.controller;

import com.example.studyhelp.sign.entity.Member;
import com.example.studyhelp.sign.jwt.JwtTokenProvider;
import com.example.studyhelp.sign.oauth2Login.util.CookieUtils;
import com.example.studyhelp.sign.repository.MemberRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    //AcessToken 유효시간 만료시 RefreshToken을 가져와 확인후 재갱신
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        log.info("Refresh token 요청 수신");

        String refreshToken = CookieUtils.getCookie(request, "refreshToken")
                .map(Cookie::getValue)
                .orElse(null);

        if (refreshToken == null) {
            log.warn("쿠키에서 Refresh Token을 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token missing");
        }

        log.info("수신된 Refresh Token: {}", refreshToken);

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            log.warn("유효하지 않거나 만료된 Refresh Token: {}", refreshToken);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token");
        }

        Long memberId = jwtTokenProvider.getMemberIdFromToken(refreshToken);
        log.info("Refresh Token 유효, Member ID: {}", memberId);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 Member ID"));

        String newAccessToken = jwtTokenProvider.createAccessToken(member.getId(), member.getEmail(), member.getRole().toString());
        CookieUtils.addCookie(response, "accessToken", newAccessToken, 60 * 60);

        log.info("새로운 Access Token 발급 성공");
        return ResponseEntity.ok("AccessToken 갱신 성공");
    }


    //로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // 클라이언트의 refreshToken 쿠키 삭제
        CookieUtils.deleteCookie(request, response, "refreshToken");
        // 클라이언트의 accessToken 쿠키 삭제
        CookieUtils.deleteCookie(request, response, "accessToken");

        return ResponseEntity.ok().body("Logged out successfully");
    }

}
