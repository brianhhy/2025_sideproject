package com.example.studyhelp.sign.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(exclude = {"password"})
public class Member implements UserDetails {

    @GeneratedValue @Id
    private Long id;

    @Column(nullable = false)
    private String email;

    private String nickname;
    private String provider;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        USER, ADMIN
    }

    // 소셜 로그인 생성자
    @Builder
    public Member(String email, String nickname, String provider) {
        this.email = email;
        this.provider = provider;
        this.role = Role.USER;
        if (nickname == null || nickname.isEmpty()) { // null 체크 추가
            this.nickname = "USER";
        } else {
            this.nickname = nickname;
        }

    }

    // 일반 로그인 생성자
    public Member(String email, String nickname, String password,String provider) {
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.provider = provider;
        this.role = Role.USER;
    }


    // UserDetails 구현 메서드
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList((GrantedAuthority) () -> "ROLE_" + this.role.name());
    }

    @Override
    public String getUsername() {
        return email+" "+provider;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}