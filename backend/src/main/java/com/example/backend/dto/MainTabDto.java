package com.example.backend.dto;

import com.example.backend.domain.MainTab;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MainTabDto {

    private Long id;              // PK
    private String name;          // 메인탭 이름
    private String description;   // 설명
    private int sortOrder;        // 정렬 순서
    private String regTime;       // 등록일 (yyyy-MM-dd HH:mm:ss)
    private String updTime;       // 수정일 (yyyy-MM-dd HH:mm:ss)

    // ✅ 날짜 포맷 지정
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ✅ Entity → DTO 변환 메서드
    public static MainTabDto fromEntity(MainTab entity) {
        return MainTabDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .sortOrder(entity.getSortOrder())
                .regTime(entity.getRegTime() != null ? entity.getRegTime().format(FORMATTER) : null)
                .updTime(entity.getUpdTime() != null ? entity.getUpdTime().format(FORMATTER) : null)
                .build();
    }
}
