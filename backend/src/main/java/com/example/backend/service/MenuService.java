package com.example.backend.service;

import com.example.backend.domain.Menu;
import com.example.backend.dto.MenuResponseDto;
import com.example.backend.dto.MenuTreeDto;
import com.example.backend.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    // ✅ 전체 메뉴 조회 (관리자용 - flat list)
    public List<MenuResponseDto> getAllMenus() {
        return menuRepository.findAll().stream()
                .map(MenuResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ✅ 메뉴 트리 구조 조회 (메인화면용)
    public List<MenuTreeDto> getMenuTree() {
        List<Menu> allMenus = menuRepository.findAll();

        // 1. 모든 메뉴를 DTO로 변환
        Map<Long, MenuTreeDto> dtoMap = allMenus.stream()
                .map(this::toTreeDto)
                .collect(Collectors.toMap(MenuTreeDto::getId, dto -> dto));

        // 2. 부모-자식 연결
        List<MenuTreeDto> rootMenus = new ArrayList<>();
        for (MenuTreeDto dto : dtoMap.values()) {
            if (dto.getParentId() == null) {
                // ✅ 대분류는 children 없어도 무조건 rootMenus 에 추가됨
                rootMenus.add(dto);
            } else {
                MenuTreeDto parent = dtoMap.get(dto.getParentId());
                if (parent != null) {
                    parent.getChildren().add(dto);
                }
            }
        }

        // 3. 정렬 (orderNum 기준)
        rootMenus.sort(Comparator.comparing(MenuTreeDto::getSortOrder,
                Comparator.nullsLast(Integer::compareTo)));
        rootMenus.forEach(this::sortChildren);

        return rootMenus;
    }

    private MenuTreeDto toTreeDto(Menu menu) {
        MenuTreeDto dto = new MenuTreeDto();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setLevel(menu.getDepth());          // ✅ depth → level
        dto.setParentId(menu.getParentId());
        dto.setSortOrder(menu.getOrderNum());   // ✅ orderNum → sortOrder
        dto.setUrl(menu.getUrl());
        dto.setUseYn(menu.getUseYn());
        return dto;
    }

    private void sortChildren(MenuTreeDto parent) {
        parent.getChildren().sort(Comparator.comparing(MenuTreeDto::getSortOrder,
                Comparator.nullsLast(Integer::compareTo)));
        parent.getChildren().forEach(this::sortChildren);
    }

    // ✅ 개별 메뉴 조회
    public MenuResponseDto getMenuById(Long id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다."));
        return MenuResponseDto.fromEntity(menu);
    }

    // ✅ 메뉴 등록
    public MenuResponseDto saveMenu(MenuResponseDto dto) {
        Menu menu = new Menu();
        menu.setName(dto.getName());
        menu.setDepth(dto.getDepth());
        menu.setParentId(dto.getParentId());
        menu.setOrderNum(dto.getOrderNum());
        menu.setUrl(dto.getUrl());
        menu.setUseYn(dto.getUseYn());
        Menu saved = menuRepository.save(menu);
        return MenuResponseDto.fromEntity(saved);
    }

    // ✅ 메뉴 수정
    public MenuResponseDto updateMenu(Long id, MenuResponseDto dto) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다."));

        menu.setName(dto.getName());
        menu.setDepth(dto.getDepth());
        menu.setParentId(dto.getParentId());
        menu.setOrderNum(dto.getOrderNum());
        menu.setUrl(dto.getUrl());
        menu.setUseYn(dto.getUseYn());

        Menu updated = menuRepository.save(menu);
        return MenuResponseDto.fromEntity(updated);
    }

    // ✅ 메뉴 삭제
    public void deleteMenu(Long id) {
        if (!menuRepository.existsById(id)) {
            throw new RuntimeException("삭제할 메뉴가 존재하지 않습니다.");
        }
        menuRepository.deleteById(id);
    }
}
