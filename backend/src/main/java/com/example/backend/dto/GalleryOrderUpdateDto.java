package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GalleryOrderUpdateDto {
    private Long id;        // 갤러리 이미지 ID
    private int sortOrder;  // 변경된 정렬 번호
}
