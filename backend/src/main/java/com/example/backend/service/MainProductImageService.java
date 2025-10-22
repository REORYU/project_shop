package com.example.backend.service;

import com.example.backend.domain.MainProduct;
import com.example.backend.domain.MainProductImage;
import com.example.backend.repository.MainProductImageRepository;
import com.example.backend.repository.MainProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MainProductImageService {

    private final MainProductImageRepository imageRepository;
    private final MainProductRepository productRepository;

    private final String uploadPath = "c:/shop/main/"; // ✅ 고정 경로

    // ✅ 상품 이미지 등록
    public void addImages(Long productId, MultipartFile[] files, String repImgYn) throws IOException {
        MainProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // 기존 이미지 개수 → 정렬 순서 이어붙이기
        int sort = imageRepository.findByProductOrderBySortOrderAsc(product).size();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

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
                    .sortOrder(sort++)
                    .build();

            imageRepository.save(image);
        }
    }

    // ✅ 상품 이미지 목록 조회
    public List<MainProductImage> getImages(Long productId) {
        MainProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return imageRepository.findByProductOrderBySortOrderAsc(product);
    }
}
