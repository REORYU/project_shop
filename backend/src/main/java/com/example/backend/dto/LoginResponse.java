package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private boolean success;   // 로그인 성공 여부
    private Long memberId;     // 회원 ID
    private String email;      // 이메일
    private String name;       // 이름
    private String role;       // 권한 (USER / ADMIN)
}
