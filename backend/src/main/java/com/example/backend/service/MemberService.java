package com.example.backend.service;

import com.example.backend.domain.Member;
import com.example.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 회원가입
     */
    public Member registerMember(Member member) {
        log.info(">>> 회원가입 요청: {}", member);

        // ✅ 이메일은 항상 소문자로 저장
        String normalizedEmail = member.getEmail().toLowerCase();

        if (memberRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            log.warn("이미 사용 중인 이메일: {}", normalizedEmail);
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }

        member.setEmail(normalizedEmail);

        // ✅ 비밀번호 암호화
        member.setPassword(passwordEncoder.encode(member.getPassword()));

        // ✅ role 기본값 USER
        if (member.getRole() == null || member.getRole().isEmpty()) {
            member.setRole("USER");
        }

        Member saved = memberRepository.save(member);
        log.info(">>> 회원가입 성공: {}", saved);
        return saved;
    }

    /**
     * 로그인
     */
    public Member login(String email, String rawPassword) {
        String normalizedEmail = email.toLowerCase();
        log.info(">>> 로그인 시도: {}", normalizedEmail);

        Member member = memberRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> {
                    log.warn("이메일 없음: {}", normalizedEmail);
                    return new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
                });

        if (!passwordEncoder.matches(rawPassword, member.getPassword())) {
            log.warn("비밀번호 불일치: {}", normalizedEmail);
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        log.info(">>> 로그인 성공: {}", member.getEmail());
        return member;
    }
}
