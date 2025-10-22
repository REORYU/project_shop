package com.example.backend.service;

import com.example.backend.domain.MainProduct;
import com.example.backend.domain.MainProductImage;
import com.example.backend.domain.MainTab;
import com.example.backend.dto.MainProductDto;
import com.example.backend.repository.MainProductImageRepository;
import com.example.backend.repository.MainProductRepository;
import com.example.backend.repository.MainTabRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MainProductService {

    private final MainProductRepository mainProductRepository;
    private final MainProductImageRepository mainProductImageRepository;
    private final MainTabRepository mainTabRepository;

    private final String uploadPath = "c:/shop/main/"; // ✅ 고정 경로

    // ✅ 상품 등록 (이미지 포함)
    public MainProduct saveProduct(MainProduct product, Long mainTabId,
                                   MultipartFile[] mainImages, MultipartFile[] detailImages) throws IOException {
        MainTab mainTab = mainTabRepository.findById(mainTabId)
                .orElseThrow(() -> new IllegalArgumentException("MainTab not found"));

        product.setMainTab(mainTab);
        MainProduct savedProduct = mainProductRepository.save(product);

        // 대표 이미지 저장
        if (mainImages != null) {
            int sort = 0;
            for (MultipartFile file : mainImages) {
                saveImage(savedProduct, file, "Y", sort++);
            }
        }

        // 상세 이미지 저장
        if (detailImages != null) {
            int sort = 0;
            for (MultipartFile file : detailImages) {
                saveImage(savedProduct, file, "N", sort++);
            }
        }

        return savedProduct;
    }

    // ✅ 상품 수정 (DTO 기반, 이미지 제외)
    public MainProduct saveProductOnlyFromDto(MainProductDto dto) {
        MainTab mainTab = mainTabRepository.findById(dto.getMainTabId())
                .orElseThrow(() -> new IllegalArgumentException("MainTab not found"));

        MainProduct product = mainProductRepository.findById(dto.getId())
                .orElse(MainProduct.builder().build());

        product.setId(dto.getId());
        product.setTitle(dto.getTitle());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setDescription(dto.getDescription());
        product.setStatus(dto.getStatus());
        product.setSortOrder(dto.getSortOrder());
        product.setMainTab(mainTab);

        return mainProductRepository.save(product);
    }

    // ✅ 상품 정렬 저장 (DTO 기반)
    public void updateSortOrderFromDto(List<MainProductDto> products) {
        for (MainProductDto dto : products) {
            MainProduct product = mainProductRepository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("MainProduct not found"));

            product.setSortOrder(dto.getSortOrder());
            mainProductRepository.save(product);
        }
    }

    // ✅ 이미지 저장 헬퍼
    private void saveImage(MainProduct product, MultipartFile file, String repImgYn, int sortOrder) throws IOException {
        if (file.isEmpty()) return;

        String originalFileName = file.getOriginalFilename();
        String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
        String savedFileName = UUID.randomUUID() + ext;

        File dest = new File(uploadPath + savedFileName);
        dest.getParentFile().mkdirs(); // ✅ 경로 자동 생성
        file.transferTo(dest);

        MainProductImage image = MainProductImage.builder()
                .product(product)
                .fileName(savedFileName)
                .imgUrl("/images/main/" + savedFileName)
                .repImgYn(repImgYn)
                .sortOrder(sortOrder)
                .build();

        mainProductImageRepository.save(image);
    }

    // ✅ 상품 목록 (탭별)
    public Page<MainProduct> getProductsByTab(Long mainTabId, Pageable pageable) {
        MainTab mainTab = mainTabRepository.findById(mainTabId)
                .orElseThrow(() -> new IllegalArgumentException("MainTab not found"));
        return mainProductRepository.findByMainTabOrderBySortOrderAsc(mainTab, pageable);
    }

    // ✅ 상품 상세
    public Optional<MainProduct> getProduct(Long id) {
        return mainProductRepository.findById(id);
    }

    // ✅ 상품 삭제 (Cascade 적용)
    public void deleteProducts(List<Long> ids) {
        for (Long id : ids) {
            mainProductRepository.findById(id).ifPresent(product -> {
                mainProductRepository.delete(product); // ✅ Cascade + orphanRemoval 작동
            });
        }
    }
}
