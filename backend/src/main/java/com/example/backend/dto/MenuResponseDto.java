package com.example.backend.dto;

import com.example.backend.domain.Menu;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponseDto {
    private Long id;
    private String name;       // DB 기본 name
    private String nameKo;     // 한글명
    private String nameEn;     // 영문명
    private int depth;
    private int orderNum;
    private LocalDateTime regTime;
    private LocalDateTime updateTime;
    private String url;
    private String useYn;
    private Long parentId;

    // ✅ Entity → DTO 변환
    public static MenuResponseDto fromEntity(Menu menu) {
        return new MenuResponseDto(
                menu.getId(),
                menu.getName(),          // 기본 name
                menu.getName(),          // 임시: name을 nameKo로
                menu.getName(),          // 임시: name을 nameEn으로
                menu.getDepth(),
                menu.getOrderNum(),
                menu.getRegTime(),
                menu.getUpdateTime(),
                menu.getUrl(),
                menu.getUseYn(),
                menu.getParentId()
        );
    }
}
