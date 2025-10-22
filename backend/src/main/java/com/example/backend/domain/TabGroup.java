package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tab_group")
@Getter
@Setter
public class TabGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // PK

    @Column(nullable = false, length = 100)
    private String name;  // 탭 이름

    @Column(length = 500)
    private String description;  // 설명

    @Column(name = "sort_order")
    private Integer sortOrder;   // 정렬 순서 (null 허용)

    @Column(nullable = false)
    private boolean visible;     // 노출 여부 (boolean → DB tinyint(1) 매핑)

    // =============================
    // ✅ FK 관계 (실제 값만 저장)
    // =============================
    @Column(name = "menu_category_id")
    private Long menuCategoryId; // 메뉴 카테고리 ID (대분류 카테고리 구분용)

    @Column(name = "menu_id")
    private Long menuId;         // 대분류 ID

    @Column(name = "sub_menu_id")
    private Long subMenuId;      // 중분류 ID

    // =============================
    // ✅ DB에 저장하지 않는 보조 필드
    // =============================
    @Transient
    private String menuName;     // 대분류 이름

    @Transient
    private String subMenuName;  // 중분류 이름

    // =============================
    // ✅ 안전한 Getter (Null 방어)
    // =============================
    public String getMenuName() {
        return menuName != null ? menuName : "";
    }

    public String getSubMenuName() {
        return subMenuName != null ? subMenuName : "";
    }
}
