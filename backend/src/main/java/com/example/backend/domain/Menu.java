package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "menu_category") // ✅ 실제 테이블명
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 메뉴 단계 (1=대분류, 2=중분류)
    @Column(name = "depth", nullable = false)
    private int depth;

    // 메뉴 이름
    @Column(name = "name", nullable = false)
    private String name;

    // 정렬 순서
    @Column(name = "order_num", nullable = false)
    private int orderNum;

    // 등록일
    @Column(name = "reg_time")
    private LocalDateTime regTime;

    // 수정일
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    // URL
    @Column(name = "url")
    private String url;

    // 사용 여부 (Y/N)
    @Column(name = "use_yn")
    private String useYn;

    // 상위 메뉴 (대분류면 NULL)
    @Column(name = "parent_id")
    private Long parentId;
}
