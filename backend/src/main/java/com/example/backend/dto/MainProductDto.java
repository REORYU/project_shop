package com.example.backend.dto;

import com.example.backend.domain.MainProduct;
import com.example.backend.domain.MainProductImage;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MainProductDto {

    private Long id;                // PK
    private String title;           // 상품명
    private int price;              // 가격
    private int stock;              // 재고 수량
    private String description;     // 상세 설명
    private String status;          // 판매 상태
    private Integer sortOrder;      // 정렬 순서
    private LocalDateTime regTime;  // 등록일
    private LocalDateTime updTime;  // 수정일

    private Long mainTabId;         // 메인탭 ID
    private String mainTabName;     // 메인탭 이름

    // ✅ 이미지 경로 리스트
    private List<String> imagePaths;

    // ✅ 엔티티 → DTO 변환 생성자
    public MainProductDto(MainProduct product) {
        this.id = product.getId();
        this.title = product.getTitle();
        this.price = product.getPrice();
        this.stock = product.getStock();
        this.description = product.getDescription();
        this.status = product.getStatus();
        this.sortOrder = product.getSortOrder();
        this.regTime = product.getRegTime();
        this.updTime = product.getUpdTime();

        if (product.getMainTab() != null) {
            this.mainTabId = product.getMainTab().getId();
            this.mainTabName = product.getMainTab().getName();
        }

        if (product.getImages() != null) {
            this.imagePaths = product.getImages().stream()
                    .map(MainProductImage::getImgUrl)  // ✅ 올바른 getter
                    .collect(Collectors.toList());
        }
    }
}
