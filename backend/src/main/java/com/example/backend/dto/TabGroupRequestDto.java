package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * TabGroup 등록/수정 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TabGroupRequestDto {

    private String name;          // 탭 그룹 이름
    private String description;   // 설명
    private Integer sortOrder;    // 정렬 순서
    private boolean visible;      // 노출 여부

    private Long menuId;          // 대분류 ID
    private Long subMenuId;       // 중분류 ID
    private Long menuCategoryId;  // 메뉴 카테고리 ID
}
