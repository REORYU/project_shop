package com.example.backend.dto;

import com.example.backend.domain.GalleryImg;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GalleryDetailResponse {
    private Long id;
    private String imgUrl;
    private String title;
    private String description;
    private Long menuId;
    private Long tabGroupId;
    private int sortOrder;

    // ✅ Entity → DTO 변환
    public static GalleryDetailResponse fromEntity(GalleryImg img) {
        return new GalleryDetailResponse(
                img.getId(),
                img.getImgUrl(),
                img.getTitle(),
                img.getDescription(),
                img.getMenuId(),
                img.getTabGroupId(),
                img.getSortOrder()
        );
    }
}
