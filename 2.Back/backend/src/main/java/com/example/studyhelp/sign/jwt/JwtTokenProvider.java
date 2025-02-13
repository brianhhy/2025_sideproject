package com.example.studyhelp.sign.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String SECRET_KEY;
    private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60; // 1시간
    //private final long ACCESS_TOKEN_EXPIRATION = 1000 * 10; // 10초(테스트)
    private final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7일

    // 액세스 토큰 생성 - 이메일, 역할, 멤버 ID를 포함
    public String createAccessToken(Long memberId, String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("memberId", memberId)
                .claim("role", role) // Role 정보 추가
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    // 리프레시 토큰 생성
    public String createRefreshToken(Long memberId, String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("memberId", memberId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    // 토큰에서 memberId 추출
    public Long getMemberIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("memberId", Long.class);
    }

    // 토큰에서 이메일 추출
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // 토큰에서 역할(Role) 추출
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true; // 유효한 토큰
        } catch (ExpiredJwtException e) {
            log.warn("JWT validation failed - Token expired: {}", e.getMessage());
            throw e; // 만료된 토큰은 예외 발생
        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage());
            return false; // 유효하지 않은 토큰
        }
    }
}


