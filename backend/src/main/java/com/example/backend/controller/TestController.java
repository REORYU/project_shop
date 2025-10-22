package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/hello")
    public String hello() {
        return "✅ Spring Boot 연결 성공!";
    }

    @GetMapping("/api/test")
    public String test() {
        return "✅ API 테스트 엔드포인트 작동 중!";
    }
}
