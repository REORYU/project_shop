package com.example.backend.dto;

import com.example.backend.domain.GalleryImg;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class GalleryImgDto {

    private Long id;
    private String imgUrl;        // 접근 가능한 이미지 URL
    private String imgName;       // 서버에 저장된 파일명
    private String oriImgName;    // 원본 파일명
    private String title;
    private String description;
    private Long menuId;
    private Long tabGroupId;
    private int sortOrder;
    private boolean detailContent; // 상세 콘텐츠 여부
    private boolean landscape;     // ✅ 가로 여부 (true=Landscape, false=Portrait)
    private int width;             // ✅ 이미지 가로 크기
    private int height;            // ✅ 이미지 세로 크기
    private LocalDateTime regTime; // 등록일

    public static GalleryImgDto fromEntity(GalleryImg img) {
        // ✅ imgUrl이 null이거나 파일명만 있는 경우 보정
        String url = img.getImgUrl();

        if (url == null || !url.startsWith("/images/gallery/")) {
            url = "/images/gallery/" + img.getImgName();
        }

        return new GalleryImgDto(
                img.getId(),
                url,                          // ✅ 항상 /images/gallery/... 로 보장
                img.getImgName(),
                img.getOriImgName(),
                img.getTitle(),
                img.getDescription(),
                img.getMenuId(),
                img.getTabGroupId(),
                img.getSortOrder(),
                img.isDetailContent(),
                img.isLandscape(),
                img.getWidth(),
                img.getHeight(),
                img.getRegTime()
        );
    }
}
