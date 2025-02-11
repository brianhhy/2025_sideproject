package com.example.studyhelp.sign.defaultLogin;

import com.example.studyhelp.sign.entity.Member;
import com.example.studyhelp.sign.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    //원래는 Email을 넣지만 Email중복이 가능하므로 memberId로 대체
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberRepository.findById(Long.parseLong(email))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with memberId: " + email));

        return member;
    }
}
