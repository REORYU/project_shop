package com.example.backend.controller;

import com.example.backend.domain.Member;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS }
)
public class AuthController {

    private final MemberService memberService;

    // ✅ 회원가입
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody Member member) {
        log.info(">>> 회원가입 요청: {}", member);

        try {
            Member saved = memberService.registerMember(member);
            return ResponseEntity.ok(new LoginResponse(
                    true,
                    saved.getMemberId(),
                    saved.getEmail(),
                    saved.getName(),
                    saved.getRole()
            ));
        } catch (IllegalStateException e) {
            log.warn("회원가입 실패 - 중복 이메일: {}", e.getMessage());
            return ResponseEntity.ok(new LoginResponse(
                    false, null, null, null, null
            ));
        } catch (Exception e) {
            log.error("회원가입 실패 (Exception)", e);
            return ResponseEntity.ok(new LoginResponse(
                    false, null, null, null, null
            ));
        }
    }

    // ✅ 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        log.info(">>> 로그인 요청: {}", req.getEmail());

        try {
            Member m = memberService.login(req.getEmail(), req.getPassword());
            return ResponseEntity.ok(new LoginResponse(
                    true,
                    m.getMemberId(),
                    m.getEmail(),
                    m.getName(),
                    m.getRole()
            ));
        } catch (IllegalArgumentException e) {
            log.warn("로그인 실패 - 잘못된 자격 증명: {}", req.getEmail());
            return ResponseEntity.ok(new LoginResponse(
                    false, null, null, null, null
            ));
        } catch (Exception e) {
            log.error("로그인 실패 (Exception)", e);
            return ResponseEntity.ok(new LoginResponse(
                    false, null, null, null, null
            ));
        }
    }
}
