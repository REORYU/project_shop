package com.example.backend.repository;

import com.example.backend.domain.TabGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TabGroupRepository extends JpaRepository<TabGroup, Long> {

    /**
     * ✅ menuId 기준 조회 (정렬 포함)
     * - 특정 대분류에 속한 탭 그룹을 정렬 순서대로 가져오기
     */
    List<TabGroup> findAllByMenuIdOrderBySortOrderAsc(Long menuId);

    /**
     * ✅ subMenuId 기준 조회 (정렬 포함)
     * - 특정 중분류에 속한 탭 그룹을 정렬 순서대로 가져오기
     */
    List<TabGroup> findAllBySubMenuIdOrderBySortOrderAsc(Long subMenuId);

    /**
     * ✅ menuCategoryId 기준 조회 (정렬 포함)
     * - 특정 메뉴 카테고리에 속한 탭 그룹을 정렬 순서대로 가져오기
     */
    List<TabGroup> findAllByMenuCategoryIdOrderBySortOrderAsc(Long menuCategoryId);

    /**
     * ✅ 전체 조회 (정렬 포함)
     * - 모든 탭 그룹을 정렬 순서대로 가져오기
     */
    List<TabGroup> findAllByOrderBySortOrderAsc();
}
