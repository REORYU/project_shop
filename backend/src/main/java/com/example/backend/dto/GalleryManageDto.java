package com.example.backend.dto;

import lombok.Data;

@Data
public class GalleryManageDto {
    private Long id;
    private String title;
    private String description;
    private String imgUrl;
    private int sortOrder;

    // ✅ 확장 필드 (관리자 화면용)
    private String menuMainName;   // 대그룹 이름
    private String menuSubName;    // 중메뉴 이름
    private String tabGroupName;   // 탭 그룹 이름
    private String regTime;        // 등록일 (YYYY-MM-DD 형태)

    // ✅ 수정 모달에서 필요
    private Long menuId;           // 메뉴 ID
    private Long tabGroupId;       // 탭 그룹 ID
    private Boolean detailContent; // 상세 콘텐츠 여부 (Boolean으로 수정)

    // ✅ 선택적: 이미지 정보
    private Integer width;         // 가로
    private Integer height;        // 세로
}
