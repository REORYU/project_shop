package com.example.backend.dto;

import com.example.backend.domain.TabGroup;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * TabGroup 조회 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TabGroupResponseDto {

    private Long id;             // 탭 그룹 ID
    private String name;         // 탭 이름
    private String description;  // 설명
    private Integer sortOrder;   // 정렬 순서
    private boolean visible;     // 노출 여부

    private Long menuId;         // 대분류 ID
    private String menuName;     // 대분류 이름
    private Long subMenuId;      // 중분류 ID
    private String subMenuName;  // 중분류 이름

    /**
     * ✅ Entity → DTO 기본 변환
     * menuName, subMenuName은 Service에서 채워줌
     */
    public static TabGroupResponseDto fromEntity(TabGroup tabGroup) {
        if (tabGroup == null) return null;

        return TabGroupResponseDto.builder()
                .id(tabGroup.getId())
                .name(tabGroup.getName())
                .description(tabGroup.getDescription())
                .sortOrder(tabGroup.getSortOrder())
                .visible(tabGroup.isVisible())
                .menuId(tabGroup.getMenuId())
                .subMenuId(tabGroup.getSubMenuId())
                .build();
    }

    /**
     * ✅ Entity + 이름까지 세팅할 수 있는 팩토리 메서드
     */
    public static TabGroupResponseDto fromEntityWithNames(TabGroup tabGroup, String menuName, String subMenuName) {
        if (tabGroup == null) return null;

        return TabGroupResponseDto.builder()
                .id(tabGroup.getId())
                .name(tabGroup.getName())
                .description(tabGroup.getDescription())
                .sortOrder(tabGroup.getSortOrder())
                .visible(tabGroup.isVisible())
                .menuId(tabGroup.getMenuId())
                .menuName(menuName)
                .subMenuId(tabGroup.getSubMenuId())
                .subMenuName(subMenuName)
                .build();
    }
}
