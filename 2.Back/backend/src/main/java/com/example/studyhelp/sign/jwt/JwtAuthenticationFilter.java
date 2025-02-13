package com.example.studyhelp.sign.jwt;

import com.example.studyhelp.sign.defaultLogin.CustomUserDetailsService;
import com.example.studyhelp.sign.oauth2Login.util.CookieUtils;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.naming.AuthenticationException;
import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // 🔹 토큰 검사가 필요 없는 URL은 필터링에서 제외
        if (path.startsWith("/api/public/") || path.equals("/api/auth/refresh")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = resolveToken(request); // 헤더에서 토큰 추출

        try {
            if (token != null && jwtTokenProvider.validateToken(token)) {
                Long memberId = jwtTokenProvider.getMemberIdFromToken(token);

                // UserDetailsService를 통해 UserDetails 객체 로드
                UserDetails userDetails = userDetailsService.loadUserByUsername(memberId+"");

                log.info("✅ JWT Filter - Valid token, memberId: {}", memberId);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } else {
                log.warn("❌ JWT Filter - Invalid token or token not found");

                // ✅ JSON 응답 반환 (401 Unauthorized)
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json; charset=UTF-8");
                response.getWriter().write("{\"success\": false, \"message\": \"로그인하세요.\"}");
                response.getWriter().flush();
                return; // 요청 중단
            }

        } catch (ExpiredJwtException e) {
            log.warn("❌ JWT Filter - Expired token: {}", e.getMessage());

            // ✅ JSON 응답 반환 (401 Unauthorized)
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().write("{\"success\": false, \"message\": \"토큰이 만료되었습니다. 다시 로그인하세요.\"}");
            response.getWriter().flush();
            return; // 요청 중단

        } catch (Exception e) {
            log.error("❌ JWT Filter - Error validating token: {}", e.getMessage());

            // ✅ JSON 응답 반환 (401 Unauthorized)
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().write("{\"success\": false, \"message\": \"유효하지 않은 토큰입니다.\"}");
            response.getWriter().flush();
            return; // 요청 중단
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        // CookieUtils를 사용하여 쿠키에서 accessToken 검색
        return CookieUtils.getCookie(request, "accessToken")
                .map(Cookie::getValue)
                .orElse(null);
    }
}
