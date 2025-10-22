package com.example.backend.service;

import com.example.backend.domain.GalleryImg;
import com.example.backend.dto.GalleryDetailResponse;
import com.example.backend.repository.GalleryImgRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GalleryDetailService {

    private final GalleryImgRepository galleryImgRepository;

    // ✅ 특정 메뉴 + 탭 그룹의 이미지 목록 조회
    public List<GalleryDetailResponse> getGalleryDetail(Long menuId, Long tabGroupId) {
        List<GalleryImg> imgs = galleryImgRepository.findByMenuIdAndTabGroupId(menuId, tabGroupId);

        return imgs.stream()
                .map(GalleryDetailResponse::fromEntity) // DTO 변환
                .collect(Collectors.toList());
    }
}
