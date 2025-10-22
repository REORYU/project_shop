package com.example.backend.controller;

import com.example.backend.domain.MainTab;
import com.example.backend.dto.MainTabDto;
import com.example.backend.service.MainTabService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/maintab")   // ✅ 메인탭 전용 API
@RequiredArgsConstructor
public class MainTabApiController {

    private final MainTabService mainTabService;

    /**
     * ✅ 메인탭 페이징 조회 (정렬순: sortOrder ASC, id ASC 보조정렬)
     * - 예: /api/maintab?page=0&size=5
     */
    @GetMapping
    public Page<MainTabDto> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MainTab> mainTabs = mainTabService.getAllSorted(pageable);

        // ✅ Entity → DTO 변환
        List<MainTabDto> dtoList = mainTabs.getContent().stream()
                .map(MainTabDto::fromEntity)
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, mainTabs.getTotalElements());
    }

    /**
     * ✅ 메인탭 단일 조회
     */
    @GetMapping("/{id}")
    public MainTabDto getById(@PathVariable Long id) {
        MainTab mainTab = mainTabService.getById(id);
        return MainTabDto.fromEntity(mainTab);
    }

    /**
     * ✅ 메인탭 등록
     * - sortOrder는 Service에서 자동 부여됨
     */
    @PostMapping
    public MainTabDto create(@RequestBody MainTab mainTab) {
        MainTab saved = mainTabService.create(mainTab);
        return MainTabDto.fromEntity(saved);
    }

    /**
     * ✅ 메인탭 수정
     */
    @PutMapping("/{id}")
    public MainTabDto update(@PathVariable Long id, @RequestBody MainTab mainTab) {
        MainTab updated = mainTabService.update(id, mainTab);
        return MainTabDto.fromEntity(updated);
    }

    /**
     * ✅ 메인탭 삭제
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        mainTabService.delete(id);
    }

    /**
     * ✅ 메인탭 정렬 순서 저장
     * - 프론트에서 [{id:1, sortOrder:1}, {id:2, sortOrder:2}] 형식으로 전달
     */
    @PutMapping("/sort")
    public void updateSort(@RequestBody List<Map<String, Object>> mainTabs) {
        mainTabs.forEach(tab -> {
            Long id = Long.valueOf(tab.get("id").toString());
            int sortOrder = Integer.parseInt(tab.get("sortOrder").toString());
            mainTabService.updateSortOrder(id, sortOrder);
        });
    }
}
