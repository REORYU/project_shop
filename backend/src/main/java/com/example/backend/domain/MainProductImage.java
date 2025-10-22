package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "main_product_image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MainProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // PK

    @Column(nullable = false, length = 255)
    private String fileName;   // 실제 파일명

    @Column(nullable = false, length = 500)
    private String imgUrl;   // 접근 가능한 이미지 경로

    @Column(nullable = false, length = 1)
    @Builder.Default
    private String repImgYn = "N";   // 대표 이미지 여부 (Y/N)

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;   // 정렬 순서

    // ✅ 메인상품과 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_product_id", nullable = false)
    private MainProduct product;

    // ✅ 명확한 메서드 제공 (DTO 변환 시 용이)
    public String getImgUrl() {
        return this.imgUrl;
    }
}
