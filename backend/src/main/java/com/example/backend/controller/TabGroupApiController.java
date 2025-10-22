package com.example.backend.controller;

import com.example.backend.dto.TabGroupRequestDto;
import com.example.backend.dto.TabGroupResponseDto;
import com.example.backend.service.TabGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tabgroup")   // ✅ 모든 요청은 /api/tabgroup 으로 통일
@RequiredArgsConstructor
public class TabGroupApiController {

    private final TabGroupService tabGroupService;

    /**
     * ✅ 탭 그룹 조회
     * - subMenuId 있으면 해당 중분류 탭 그룹만 반환
     * - menuId 있으면 해당 대분류 탭 그룹만 반환
     * - menuCategoryId 있으면 해당 카테고리 탭 그룹만 반환
     * - 아무 파라미터도 없으면 전체 반환
     */
    @GetMapping
    public List<TabGroupResponseDto> getTabGroups(
            @RequestParam(required = false) Long menuId,
            @RequestParam(required = false) Long subMenuId,
            @RequestParam(required = false) Long menuCategoryId
    ) {
        if (subMenuId != null) {
            return tabGroupService.getTabGroupsBySubMenuId(subMenuId);
        } else if (menuId != null) {
            return tabGroupService.getTabGroupsByMenuId(menuId);
        } else if (menuCategoryId != null) {
            return tabGroupService.getTabGroupsByMenuCategoryId(menuCategoryId);
        } else {
            return tabGroupService.getAllTabGroups();
        }
    }

    /**
     * ✅ 탭 그룹 단건 조회
     */
    @GetMapping("/{id}")
    public TabGroupResponseDto getTabGroup(@PathVariable Long id) {
        return tabGroupService.getTabGroupById(id);
    }

    /**
     * ✅ 탭 그룹 등록
     */
    @PostMapping
    public TabGroupResponseDto createTabGroup(@RequestBody TabGroupRequestDto dto) {
        return tabGroupService.saveTabGroup(dto);
    }

    /**
     * ✅ 탭 그룹 수정
     */
    @PutMapping("/{id}")
    public TabGroupResponseDto updateTabGroup(
            @PathVariable Long id,
            @RequestBody TabGroupRequestDto dto
    ) {
        return tabGroupService.updateTabGroup(id, dto);
    }

    /**
     * ✅ 탭 그룹 단일 삭제
     */
    @DeleteMapping("/{id}")
    public void deleteTabGroup(@PathVariable Long id) {
        tabGroupService.deleteTabGroup(id);
    }

    /**
     * ✅ 탭 그룹 다중 삭제
     * - 요청 예시: DELETE /api/tabgroup/bulk
     *   RequestBody: [1, 2, 3]
     */
    @DeleteMapping("/bulk")
    public void deleteTabGroups(@RequestBody List<Long> ids) {
        tabGroupService.deleteTabGroups(ids);
    }
}
