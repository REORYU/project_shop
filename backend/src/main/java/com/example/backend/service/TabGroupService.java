package com.example.backend.service;

import com.example.backend.domain.TabGroup;
import com.example.backend.domain.Menu;
import com.example.backend.dto.TabGroupRequestDto;
import com.example.backend.dto.TabGroupResponseDto;
import com.example.backend.repository.TabGroupRepository;
import com.example.backend.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TabGroupService {

    private final TabGroupRepository tabGroupRepository;
    private final MenuRepository menuRepository;

    /**
     * ✅ 등록
     */
    @Transactional
    public TabGroupResponseDto saveTabGroup(TabGroupRequestDto dto) {
        TabGroup tabGroup = new TabGroup();
        tabGroup.setName(dto.getName());
        tabGroup.setDescription(dto.getDescription());
        tabGroup.setSortOrder(dto.getSortOrder());
        tabGroup.setVisible(dto.isVisible());

        // ✅ FK 값 세팅
        tabGroup.setMenuId(dto.getMenuId());
        tabGroup.setSubMenuId(dto.getSubMenuId());
        tabGroup.setMenuCategoryId(dto.getMenuCategoryId());

        TabGroup saved = tabGroupRepository.save(tabGroup);
        return enrichWithMenuNames(saved);
    }

    /**
     * ✅ subMenuId 기준 조회
     */
    public List<TabGroupResponseDto> getTabGroupsBySubMenuId(Long subMenuId) {
        return tabGroupRepository.findAllBySubMenuIdOrderBySortOrderAsc(subMenuId)
                .stream()
                .map(this::enrichWithMenuNames)
                .toList();
    }

    /**
     * ✅ menuId 기준 조회
     */
    public List<TabGroupResponseDto> getTabGroupsByMenuId(Long menuId) {
        return tabGroupRepository.findAllByMenuIdOrderBySortOrderAsc(menuId)
                .stream()
                .map(this::enrichWithMenuNames)
                .toList();
    }

    /**
     * ✅ menuCategoryId 기준 조회
     */
    public List<TabGroupResponseDto> getTabGroupsByMenuCategoryId(Long menuCategoryId) {
        return tabGroupRepository.findAllByMenuCategoryIdOrderBySortOrderAsc(menuCategoryId)
                .stream()
                .map(this::enrichWithMenuNames)
                .toList();
    }

    /**
     * ✅ 전체 조회
     */
    public List<TabGroupResponseDto> getAllTabGroups() {
        return tabGroupRepository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(this::enrichWithMenuNames)
                .toList();
    }

    /**
     * ✅ 단건 조회
     */
    public TabGroupResponseDto getTabGroupById(Long id) {
        return tabGroupRepository.findById(id)
                .map(this::enrichWithMenuNames)
                .orElseThrow(() -> new IllegalArgumentException("❌ TabGroup not found: " + id));
    }

    /**
     * ✅ 수정
     */
    @Transactional
    public TabGroupResponseDto updateTabGroup(Long id, TabGroupRequestDto dto) {
        TabGroup tabGroup = tabGroupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("❌ TabGroup not found: " + id));

        tabGroup.setName(dto.getName());
        tabGroup.setDescription(dto.getDescription());
        tabGroup.setSortOrder(dto.getSortOrder());
        tabGroup.setVisible(dto.isVisible());

        // ✅ FK 값 세팅
        tabGroup.setMenuId(dto.getMenuId());
        tabGroup.setSubMenuId(dto.getSubMenuId());
        tabGroup.setMenuCategoryId(dto.getMenuCategoryId());

        TabGroup updated = tabGroupRepository.save(tabGroup);
        return enrichWithMenuNames(updated);
    }

    /**
     * ✅ 단일 삭제
     */
    @Transactional
    public void deleteTabGroup(Long id) {
        if (!tabGroupRepository.existsById(id)) {
            throw new IllegalArgumentException("❌ TabGroup not found: " + id);
        }
        tabGroupRepository.deleteById(id);
    }

    /**
     * ✅ 다중 삭제
     */
    @Transactional
    public void deleteTabGroups(List<Long> ids) {
        tabGroupRepository.deleteAllById(ids);
    }

    // ===========================
    // 내부 헬퍼: 메뉴 이름 매핑
    // ===========================
    private TabGroupResponseDto enrichWithMenuNames(TabGroup group) {
        String menuName = null;
        if (group.getMenuId() != null) {
            menuName = menuRepository.findById(group.getMenuId())
                    .map(Menu::getName)
                    .orElse(null);
        }

        String subMenuName = null;
        if (group.getSubMenuId() != null) {
            subMenuName = menuRepository.findById(group.getSubMenuId())
                    .map(Menu::getName)
                    .orElse(null);
        }

        return TabGroupResponseDto.fromEntityWithNames(group, menuName, subMenuName);
    }
}
