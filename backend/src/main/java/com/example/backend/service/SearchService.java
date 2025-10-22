package com.example.backend.service;

import com.example.backend.domain.Product;
import com.example.backend.domain.GalleryImg;
import com.example.backend.dto.SearchResultDto;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.GalleryImgRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProductRepository productRepository;
    private final GalleryImgRepository galleryImgRepository;

    /**
     * 🔍 메인상품 + 갤러리 이미지 검색 (제목 + 설명)
     */
    public List<SearchResultDto> searchAll(String keyword) {
        List<SearchResultDto> results = new ArrayList<>();

        // ✅ 키워드 앞뒤 공백 제거
        String cleanKeyword = (keyword == null) ? "" : keyword.trim();
        if (cleanKeyword.isEmpty()) {
            return results; // 빈 검색어일 경우 결과 없음
        }

        // ✅ 메인 상품 검색 (제목 기준)
        List<Product> products = productRepository.findByTitleContainingIgnoreCase(cleanKeyword);
        for (Product p : products) {
            results.add(new SearchResultDto(
                    p.getId(),
                    p.getTitle(),
                    p.getImgUrl(),
                    "PRODUCT"
            ));
        }

        // ✅ 갤러리 이미지 검색 (제목 + 설명 기준)
        List<GalleryImg> galleryImgs = galleryImgRepository
                .searchByTitleOrDescription(cleanKeyword, null) // pageable = null (전체 검색)
                .getContent();

        for (GalleryImg gi : galleryImgs) {
            results.add(new SearchResultDto(
                    gi.getId(),
                    gi.getTitle(),
                    gi.getImgUrl(),
                    "GALLERY"
            ));
        }

        return results;
    }
}
