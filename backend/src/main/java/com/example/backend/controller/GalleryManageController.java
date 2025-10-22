package com.example.backend.controller;

import com.example.backend.dto.GalleryOrderUpdateDto;
import com.example.backend.dto.GalleryManageDto;
import com.example.backend.domain.GalleryImg;
import com.example.backend.service.GalleryImgService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/gallery/manage")
@RequiredArgsConstructor
public class GalleryManageController {

    private final GalleryImgService galleryImgService;

    /**
     * ✅ 갤러리 전체 목록 조회 (관리자용, 페이징 + 검색 지원)
     */
    @GetMapping("/list")
    public Page<GalleryManageDto> getAllImages(
            Pageable pageable,
            @RequestParam(required = false) String field,
            @RequestParam(required = false) String keyword
    ) {
        return galleryImgService.getAllImages(pageable, field, keyword);
    }

    /**
     * ✅ 단건 조회 (수정 모달 열 때 사용)
     */
    @GetMapping("/{id}")
    public ResponseEntity<GalleryManageDto> getImage(@PathVariable Long id) {
        GalleryManageDto dto = galleryImgService.getImageById(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * ✅ 정렬 순서 저장
     */
    @PostMapping("/updateOrder")
    public ResponseEntity<String> updateOrder(@RequestBody List<GalleryOrderUpdateDto> orderList) {
        galleryImgService.updateSortOrders(orderList);
        return ResponseEntity.ok("정렬 순서가 저장되었습니다.");
    }

    /**
     * ✅ 이미지 단일 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteImage(@PathVariable Long id) {
        galleryImgService.delete(id);
        return ResponseEntity.ok("삭제되었습니다.");
    }

    /**
     * ✅ 이미지 다중 삭제
     */
    @DeleteMapping("/bulk")
    public ResponseEntity<String> deleteImages(@RequestBody List<Long> ids) {
        galleryImgService.deleteAll(ids);
        return ResponseEntity.ok("선택된 이미지가 삭제되었습니다.");
    }

    /**
     * ✅ 이미지 수정 (파일 교체 포함)
     */
    @PutMapping("/{id}")
    public ResponseEntity<GalleryImg> updateImage(
            @PathVariable Long id,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam Long menuId,
            @RequestParam(required = false) Long tabGroupId,
            @RequestParam(required = false) String description,
            @RequestParam(defaultValue = "false") boolean isDetailContent
    ) throws IOException {
        GalleryImg saved = galleryImgService.updateImage(id, file, menuId, tabGroupId, description, isDetailContent);
        return ResponseEntity.ok(saved);
    }

    /**
     * ✅ 이미지 이동
     */
    @PostMapping("/{id}/move")
    public ResponseEntity<String> moveImage(
            @PathVariable Long id,
            @RequestParam(required = false) Long newMenuId,
            @RequestParam(required = false) Long newTabGroupId
    ) {
        galleryImgService.moveImage(id, newMenuId, newTabGroupId);
        return ResponseEntity.ok("이미지가 이동되었습니다.");
    }
}
