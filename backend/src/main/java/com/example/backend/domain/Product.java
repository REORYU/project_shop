package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ 상품 제목
    @Column(nullable = false, length = 255)
    private String title;

    // ✅ 상품 설명
    @Column(length = 1000)
    private String description;

    // ✅ 대표 이미지 URL (선택)
    @Column(length = 500)
    private String imgUrl;

    // ✅ 등록일
    private LocalDateTime regTime;

    // ✅ 수정일
    private LocalDateTime updateTime;
}
