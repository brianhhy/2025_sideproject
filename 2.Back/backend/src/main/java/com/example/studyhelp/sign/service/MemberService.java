package com.example.studyhelp.sign.service;

import com.example.studyhelp.sign.dto.DefaultSignUpRequest;
import com.example.studyhelp.sign.dto.DefaultLoginRequest;
import com.example.studyhelp.sign.dto.RegisterSocialMemberDto;
import com.example.studyhelp.sign.entity.Member;
import com.example.studyhelp.sign.jwt.JwtTokenProvider;
import com.example.studyhelp.sign.oauth2Login.util.CookieUtils;
import com.example.studyhelp.sign.repository.MemberRepository;
import com.example.studyhelp.upload.entity.Folder;
import com.example.studyhelp.upload.repository.FolderRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
@Slf4j
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final FolderRepository folderRepository;

    /*
    소셜로그인 회원가입 or 로그인
    @return Member
    * 새로만들기 or 기존정보**/
    @Transactional
    public Member registerSocialMember(RegisterSocialMemberDto registerSocialMemberDto){
        Member member = Member.builder()
                .email(registerSocialMemberDto.getEmail())
                .nickname(registerSocialMemberDto.getNickname())
                .provider(registerSocialMemberDto.getProvider()).build();

        log.info("Member = {}",member.toString());

        Optional<Member> memberByEmailAndAndProvider = memberRepository.findMemberByEmailAndAndProvider(member.getEmail(), member.getProvider());

        //이메일&프로바이더가 존재
        if(memberByEmailAndAndProvider.isPresent()){
            return memberByEmailAndAndProvider.get();
        }

        memberRepository.save(member);
        return member;
    }

    /*
    일반로그인 회원가입
    @return boolean **/
    @Transactional
    public boolean signUpDefaultMember(DefaultSignUpRequest defaultSignUpRequest) {
        Optional<Member> findMember = memberRepository.findMemberByEmailAndAndProvider(defaultSignUpRequest.getEmail(), "DEFAULT");

        // 중복된 이메일 확인
        if (findMember.isPresent()) {
            throw new IllegalStateException("중복된 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(defaultSignUpRequest.getPassword());
        Member member = new Member(
                defaultSignUpRequest.getEmail(),
                "GUEST",
                encodedPassword,
                "DEFAULT"
        );

        memberRepository.save(member);
        return true;  // 정상적으로 회원가입이 완료되면 true 반환
    }

    /*
    일반로그인 로그인
    @return boolean(로그인 여부) **/
    @Transactional
    public boolean loginDefaultMember(DefaultLoginRequest request, HttpServletResponse response) {
        Optional<Member> findMember = memberRepository.findMemberByEmailAndAndProvider(request.getEmail(), "DEFAULT");

        log.info("loginDefaultMember");
        if (findMember.isEmpty()) {
            throw new IllegalStateException("해당 이메일을 찾을 수 없습니다.");
        }

        Member member = findMember.get();

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
        }

        applyJwtToken(member, response);
        return true;  // 로그인 성공
    }

    public boolean isHasEmail(String email){
        return memberRepository.existsMemberByEmailAndProvider(email, "DEFAULT");
    }

    public Member findByUserName(String emailAndProvider) {
        String[] parts = emailAndProvider.split(" ");

        String email = parts[0];
        String provider = parts[1];

        log.info("[MEMBER FIND LOG] " + email + " " + provider);

        return memberRepository.findMemberByEmailAndAndProvider(email, provider)
                .orElseThrow(() -> new RuntimeException("User not found with email and provider: " + emailAndProvider));
    }
    public void applyJwtToken(Member member, HttpServletResponse response){

        // TODO: 액세스 토큰, 리프레시 토큰 발급
        String accessToken = jwtTokenProvider.createAccessToken(member.getId(), member.getEmail(), Member.Role.USER.toString());
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getId(), member.getEmail());

        //클라이언트 쿠키에 refreshToken 추가
        CookieUtils.addCookie(response, "refreshToken", refreshToken, 7 * 24 * 60 * 60); // 쿠키에 리프레시 토큰 저장
        CookieUtils.addCookie(response, "accessToken", accessToken, 60 * 60); // 쿠키에 리프레시 토큰 저장
    }

}
