package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SearchResultDto {
    private Long id;
    private String title;
    private String imgUrl;
    private String type; // PRODUCT / GALLERY
}
