package com.example.studyhelp.sign.oauth2Login.handler;

import com.example.studyhelp.sign.dto.RegisterSocialMemberDto;
import com.example.studyhelp.sign.entity.Member;
import com.example.studyhelp.sign.oauth2Login.HttpCookieOAuth2AuthorizationRequestRepository;
import com.example.studyhelp.sign.oauth2Login.service.OAuth2UserPrincipal;
import com.example.studyhelp.sign.oauth2Login.user.OAuth2Provider;
import com.example.studyhelp.sign.oauth2Login.user.OAuth2UserUnlinkManager;
import com.example.studyhelp.sign.oauth2Login.util.CookieUtils;
import com.example.studyhelp.sign.service.MemberService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

import static com.example.studyhelp.sign.oauth2Login.HttpCookieOAuth2AuthorizationRequestRepository.MODE_PARAM_COOKIE_NAME;
import static com.example.studyhelp.sign.oauth2Login.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    private final OAuth2UserUnlinkManager oAuth2UserUnlinkManager;

    private final MemberService memberService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String targetUrl;

        targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) {

        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);

        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());

        String mode = CookieUtils.getCookie(request, MODE_PARAM_COOKIE_NAME)
                .map(Cookie::getValue)
                .orElse("");

        OAuth2UserPrincipal principal = getOAuth2UserPrincipal(authentication);

        if (principal == null) {
            return UriComponentsBuilder.fromUriString(targetUrl)
                    .queryParam("error", "Login failed")
                    .build().toUriString();
        }

        if ("login".equalsIgnoreCase(mode)) {
            log.info("email={}, name={},accessToken={},provider={}", principal.getUserInfo().getEmail(),
                    principal.getUserInfo().getName(),
                    principal.getUserInfo().getAccessToken(),
                    principal.getUserInfo().getProvider()
            );

            String email = principal.getUserInfo().getEmail();
            String nickname = principal.getUserInfo().getName();
            String provider = principal.getUserInfo().getProvider().toString();

            RegisterSocialMemberDto memberDto = RegisterSocialMemberDto.builder()
                    .email(email)
                    .nickname(nickname)
                    .provider(provider).build();

            // TODO: Member 객체 DB 저장
            Member member = memberService.registerSocialMember(memberDto);
            log.info("registerSocialMember = {}",member);

            // TODO: 액세스 토큰, 리프레시 토큰 발급
            // TODO: 리프레시 토큰(레디스)저장
            memberService.applyJwtToken(member,response);

            return UriComponentsBuilder.fromUriString(targetUrl)
                    .build().toUriString();

            //소셜로그인 회원탈퇴시 사용하는 기능
        } else if ("unlink".equalsIgnoreCase(mode)) {

            String accessToken = principal.getUserInfo().getAccessToken();
            OAuth2Provider provider = principal.getUserInfo().getProvider();

            // TODO: DB 삭제
            // TODO: 리프레시 토큰 삭제
            oAuth2UserUnlinkManager.unlink(provider, accessToken);

            return UriComponentsBuilder.fromUriString(targetUrl)
                    .build().toUriString();
        }

        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("error", "Login failed")
                .build().toUriString();
    }

    private OAuth2UserPrincipal getOAuth2UserPrincipal(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2UserPrincipal) {
            return (OAuth2UserPrincipal) principal;
        }
        return null;
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }
}
