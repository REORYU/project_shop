package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "gallery_img")
@Getter
@Setter
public class GalleryImg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ 서버 접근용 URL (/images/gallery/파일명)
    @Column(nullable = false, length = 255)
    private String imgUrl;

    // ✅ 서버에 저장된 파일명 (UUID 포함)
    @Column(length = 255)
    private String imgName;

    // ✅ 원본 파일명
    @Column(length = 255)
    private String oriImgName;

    // ✅ 제목
    @Column(length = 255)
    private String title;

    // ✅ 설명
    @Column(length = 1000)
    private String description;

    // ✅ 메뉴 ID
    @Column(name = "menu_id")
    private Long menuId;

    // ✅ 탭 그룹 ID
    @Column(name = "tab_group_id")
    private Long tabGroupId;

    // ✅ 정렬 순서
    @Column(name = "sort_order")
    private int sortOrder;

    // ✅ 상세 콘텐츠 여부 (true면 메인 화면 썸네일 전용)
    @Column(name = "is_detail_content", nullable = false)
    private boolean detailContent = false;

    // ✅ 가로/세로 여부 (기본 false → 세로)
    @Column(name = "is_landscape", nullable = false)
    private boolean landscape = false;

    // ✅ 가로 사이즈
    @Column(name = "width", nullable = false)
    private int width = 0;

    // ✅ 세로 사이즈
    @Column(name = "height", nullable = false)
    private int height = 0;

    // ✅ 등록일
    @Column(name = "reg_time")
    private LocalDateTime regTime;

    // ✅ 수정일 (옵션)
    @Column(name = "upd_time")
    private LocalDateTime updTime;
}
