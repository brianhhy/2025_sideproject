package com.example.studyhelp.sign.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterSocialMemberDto {

    private String email;
    private String nickname;
    private String provider;
}
