package com.example.backend.repository;

import com.example.backend.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // ✅ 이메일 대소문자 구분 없이 검색
    Optional<Member> findByEmailIgnoreCase(String email);

    // ✅ 이메일 중복 여부 (대소문자 무시)
    boolean existsByEmailIgnoreCase(String email);
}
