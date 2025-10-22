package com.example.backend.repository;

import com.example.backend.domain.MainProduct;
import com.example.backend.domain.MainProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MainProductImageRepository extends JpaRepository<MainProductImage, Long> {

    // ✅ 특정 상품의 이미지들
    List<MainProductImage> findByProductOrderBySortOrderAsc(MainProduct product);

    // ✅ 대표 이미지 1개
    MainProductImage findFirstByProductAndRepImgYn(MainProduct product, String repImgYn);
}
