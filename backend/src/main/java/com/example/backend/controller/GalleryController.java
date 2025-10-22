package com.example.backend.controller;

import com.example.backend.dto.GalleryImgDto;
import com.example.backend.service.GalleryImgService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryImgService galleryImgService;

    /**
     * ✅ 이미지 등록 (파일 업로드 + DB 저장)
     * - 실제 파일은 C:/shop/gallery/ 에 저장됨
     * - DB에는 /images/gallery/파일명 형태로 저장됨
     */
    @PostMapping("/upload")
    public ResponseEntity<GalleryImgDto> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("menuId") Long menuId,
            @RequestParam(value = "tabGroupId", required = false) Long tabGroupId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "isDetailContent", defaultValue = "false") boolean isDetailContent
    ) throws IOException {

        GalleryImgDto dto = galleryImgService.saveImage(
                file,
                menuId,
                tabGroupId,
                description,
                isDetailContent
        );

        return ResponseEntity.ok(dto);
    }

    /**
     * ✅ 메뉴 + 탭 그룹별 이미지 조회
     * - tabGroupId 없으면 해당 menuId 전체 조회
     * - tabGroupId 있으면 특정 탭 그룹 조회
     */
    @GetMapping
    public ResponseEntity<List<GalleryImgDto>> list(
            @RequestParam Long menuId,
            @RequestParam(required = false) Long tabGroupId
    ) {
        return ResponseEntity.ok(galleryImgService.getImgs(menuId, tabGroupId));
    }

    /**
     * ✅ 이미지 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        galleryImgService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
