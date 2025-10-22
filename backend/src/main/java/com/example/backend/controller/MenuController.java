package com.example.backend.controller;

import com.example.backend.dto.MenuResponseDto;
import com.example.backend.dto.MenuTreeDto;
import com.example.backend.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    // ✅ 관리자용 - 전체 리스트
    @GetMapping("/list")
    public ResponseEntity<List<MenuResponseDto>> getAllMenus() {
        return ResponseEntity.ok(menuService.getAllMenus());
    }

    // ✅ 메인 페이지용 - 트리 구조
    // 👉 대분류는 children 없어도 무조건 포함되게 MenuService에서 처리됨
    @GetMapping("/tree")
    public ResponseEntity<List<MenuTreeDto>> getMenuTree() {
        return ResponseEntity.ok(menuService.getMenuTree());
    }

    // ✅ 개별 메뉴 조회 (수정 페이지 진입용)
    @GetMapping("/{id}")
    public ResponseEntity<MenuResponseDto> getMenuById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuById(id));
    }

    // ✅ 메뉴 등록
    @PostMapping
    public ResponseEntity<MenuResponseDto> saveMenu(@RequestBody MenuResponseDto menuDto) {
        return ResponseEntity.ok(menuService.saveMenu(menuDto));
    }

    // ✅ 메뉴 수정
    @PutMapping("/{id}")
    public ResponseEntity<MenuResponseDto> updateMenu(@PathVariable Long id,
                                                      @RequestBody MenuResponseDto menuDto) {
        return ResponseEntity.ok(menuService.updateMenu(id, menuDto));
    }

    // ✅ 메뉴 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }
}
