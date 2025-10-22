package com.example.backend.controller;

import com.example.backend.domain.MainProduct;
import com.example.backend.domain.MainProductImage;
import com.example.backend.dto.MainProductDto;
import com.example.backend.service.MainProductImageService;
import com.example.backend.service.MainProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mainproduct")
@RequiredArgsConstructor
public class MainProductController {

    private final MainProductService mainProductService;
    private final MainProductImageService imageService;

    // ✅ 상품 등록
    @PostMapping
    public ResponseEntity<MainProductDto> createProduct(
            @RequestPart("product") MainProduct product,
            @RequestParam("mainTabId") Long mainTabId,
            @RequestPart(value = "mainImages", required = false) MultipartFile[] mainImages,
            @RequestPart(value = "detailImages", required = false) MultipartFile[] detailImages
    ) throws IOException {
        MainProduct saved = mainProductService.saveProduct(product, mainTabId, mainImages, detailImages);
        return ResponseEntity.ok(new MainProductDto(saved));
    }

    // ✅ 상품 목록 (탭별 조회 + 페이징)
    @GetMapping("/list")
    public ResponseEntity<Page<MainProductDto>> getProducts(
            @RequestParam Long mainTabId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<MainProduct> products = mainProductService.getProductsByTab(mainTabId, PageRequest.of(page, size));
        List<MainProductDto> dtoList = products.getContent().stream()
                .map(MainProductDto::new)
                .collect(Collectors.toList());
        Page<MainProductDto> dtoPage = new PageImpl<>(dtoList, products.getPageable(), products.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    // ✅ 상품 상세
    @GetMapping("/{id}")
    public ResponseEntity<MainProductDto> getProduct(@PathVariable Long id) {
        Optional<MainProduct> product = mainProductService.getProduct(id);
        return product.map(value -> ResponseEntity.ok(new MainProductDto(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ 상품 이미지 목록
    @GetMapping("/{id}/images")
    public ResponseEntity<List<MainProductImage>> getImages(@PathVariable Long id) {
        List<MainProductImage> images = imageService.getImages(id);
        return ResponseEntity.ok(images);
    }

    // ✅ 상품 이미지 추가
    @PostMapping("/{id}/images")
    public ResponseEntity<String> addImages(
            @PathVariable Long id,
            @RequestPart("files") MultipartFile[] files,
            @RequestParam(defaultValue = "N") String repImgYn
    ) throws IOException {
        imageService.addImages(id, files, repImgYn);
        return ResponseEntity.ok("이미지 업로드 성공");
    }

    // ✅ 상품 정렬 저장
    @PutMapping("/sort")
    public ResponseEntity<String> updateSort(@RequestBody List<MainProductDto> products) {
        mainProductService.updateSortOrderFromDto(products);
        return ResponseEntity.ok("정렬 저장 완료");
    }

    // ✅ 선택 삭제
    @DeleteMapping("/bulk")
    public ResponseEntity<String> deleteProducts(@RequestBody Map<String, List<Long>> request) {
        try {
            List<Long> ids = request.get("ids");
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body("삭제할 상품 ID가 없습니다.");
            }
            mainProductService.deleteProducts(ids);
            return ResponseEntity.ok("선택한 상품 삭제 완료");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("상품 삭제 중 오류 발생: " + e.getMessage());
        }
    }

    // ✅ 상품 수정
    @PutMapping("/{id}")
    public ResponseEntity<MainProductDto> updateProduct(
            @PathVariable Long id,
            @RequestBody MainProductDto updatedProductDto
    ) {
        return mainProductService.getProduct(id)
                .map(product -> {
                    updatedProductDto.setId(id);
                    MainProduct saved = mainProductService.saveProductOnlyFromDto(updatedProductDto);
                    return ResponseEntity.ok(new MainProductDto(saved));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
