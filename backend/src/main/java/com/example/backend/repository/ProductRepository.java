package com.example.backend.repository;

import com.example.backend.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // ✅ 상품 제목 검색 (대소문자 무시)
    List<Product> findByTitleContainingIgnoreCase(String keyword);
}
