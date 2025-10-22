package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "main_tab")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MainTab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // PK

    @Column(nullable = false, length = 255)
    private String name;   // 메인탭 이름

    @Column(length = 1000)
    private String description;   // 설명 (선택)

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;    // ✅ int → Integer (null 체크 가능)

    @Column(name = "reg_time", nullable = false)
    private LocalDateTime regTime;   // 등록일

    @Column(name = "upd_time")
    private LocalDateTime updTime;   // 수정일

    @Column(name = "created_by")
    private String createdBy;   // 작성자 (옵션)

    @Column(name = "modified_by")
    private String modifiedBy;  // 수정자 (옵션)

    @PrePersist
    public void onCreate() {
        this.regTime = LocalDateTime.now();
        if (this.sortOrder == null) {
            this.sortOrder = 0; // ✅ 기본값 보정
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updTime = LocalDateTime.now();
    }
}
