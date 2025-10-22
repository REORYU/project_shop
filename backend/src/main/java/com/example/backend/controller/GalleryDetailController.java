package com.example.backend.controller;

import com.example.backend.dto.GalleryDetailResponse;
import com.example.backend.service.GalleryDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery/detail")
@RequiredArgsConstructor
public class GalleryDetailController {

    private final GalleryDetailService galleryDetailService;

    // ✅ 메뉴 + 탭 그룹 기준 갤러리 이미지 조회
    @GetMapping
    public ResponseEntity<List<GalleryDetailResponse>> getGalleryByMenu(
            @RequestParam Long menuId,
            @RequestParam Long tabGroupId
    ) {
        return ResponseEntity.ok(galleryDetailService.getGalleryDetail(menuId, tabGroupId));
    }
}
