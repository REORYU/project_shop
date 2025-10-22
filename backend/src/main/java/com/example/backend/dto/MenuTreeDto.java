package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MenuTreeDto {
    private Long id;
    private String name;
    private Integer level;
    private Long parentId;
    private Integer sortOrder;
    private String url;
    private String useYn;

    // 자식 메뉴 리스트 (Tree 구조용)
    private List<MenuTreeDto> children = new ArrayList<>();
}
