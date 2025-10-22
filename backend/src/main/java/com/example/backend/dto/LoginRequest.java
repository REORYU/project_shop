package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor        // JSON 역직렬화에 필요 (Spring이 기본 생성자로 객체 생성 후 Setter/Reflection으로 값 바인딩)
@AllArgsConstructor       // 테스트나 직접 객체 생성 시 편리
public class LoginRequest {
    private String email;     // 로그인 이메일
    private String password;  // 로그인 비밀번호
}
