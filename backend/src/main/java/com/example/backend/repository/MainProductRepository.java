package com.example.backend.repository;

import com.example.backend.domain.MainProduct;
import com.example.backend.domain.MainTab;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MainProductRepository extends JpaRepository<MainProduct, Long> {

    // ✅ 특정 메인탭의 상품 목록 (페이징)
    Page<MainProduct> findByMainTab(MainTab mainTab, Pageable pageable);

    // ✅ 특정 메인탭의 상품 목록 (정렬순)
    Page<MainProduct> findByMainTabOrderBySortOrderAsc(MainTab mainTab, Pageable pageable);
}
