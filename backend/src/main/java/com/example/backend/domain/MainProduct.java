package com.example.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "main_product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MainProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // PK

    @Column(nullable = false, length = 255)
    private String title;   // 상품명

    @Column(nullable = false)
    private int price;   // 가격

    @Column(nullable = false)
    private int stock;   // 재고 수량

    @Column(columnDefinition = "TEXT")
    private String description;   // 상세 설명

    @Column(nullable = false, length = 20)
    private String status;   // 판매 상태 (판매중, 품절, 판매중지)

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;   // 정렬 순서

    @Column(name = "reg_time", nullable = false)
    private LocalDateTime regTime;

    @Column(name = "upd_time")
    private LocalDateTime updTime;

    // ✅ 메인탭과 연관관계 (Lazy 로딩 직렬화 예외 처리)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_tab_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private MainTab mainTab;

    // ✅ 이미지와 연관관계 (삭제 시 이미지도 같이 삭제됨)
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MainProductImage> images = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        this.regTime = LocalDateTime.now();
        if (this.sortOrder == null) {
            this.sortOrder = 0;
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updTime = LocalDateTime.now();
    }
}
