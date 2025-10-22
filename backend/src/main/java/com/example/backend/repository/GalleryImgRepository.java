package com.example.backend.repository;

import com.example.backend.domain.GalleryImg;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GalleryImgRepository extends JpaRepository<GalleryImg, Long> {

    // ✅ 메뉴 + 탭 그룹별 조회
    List<GalleryImg> findByMenuIdAndTabGroupId(Long menuId, Long tabGroupId);

    // ✅ 메뉴별 조회 (탭 그룹 없는 경우)
    List<GalleryImg> findByMenuId(Long menuId);

    // ===============================
    // 🔍 실제 DB 조건 기반 검색 메서드들
    // ===============================

    // ✅ 대그룹 이름 검색
    @Query("""
        SELECT gi
        FROM GalleryImg gi
        JOIN Menu m ON gi.menuId = m.id
        JOIN Menu parent ON m.parentId = parent.id
        WHERE LOWER(parent.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<GalleryImg> searchByMenuMainName(@Param("keyword") String keyword, Pageable pageable);

    // ✅ 중메뉴 이름 검색
    @Query("""
        SELECT gi
        FROM GalleryImg gi
        JOIN Menu m ON gi.menuId = m.id
        WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<GalleryImg> searchByMenuSubName(@Param("keyword") String keyword, Pageable pageable);

    // ✅ 탭 그룹 이름 검색
    @Query("""
        SELECT gi
        FROM GalleryImg gi
        JOIN TabGroup tg ON gi.tabGroupId = tg.id
        WHERE LOWER(tg.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<GalleryImg> searchByTabGroupName(@Param("keyword") String keyword, Pageable pageable);

    // ✅ 정렬순서 검색
    Page<GalleryImg> findBySortOrder(int sortOrder, Pageable pageable);

    // ✅ 제목 검색 (페이징)
    Page<GalleryImg> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    // ✅ 설명 검색
    Page<GalleryImg> findByDescriptionContainingIgnoreCase(String keyword, Pageable pageable);

    // ✅ 제목 + 설명 동시 검색
    @Query("""
        SELECT gi
        FROM GalleryImg gi
        WHERE LOWER(gi.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(gi.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<GalleryImg> searchByTitleOrDescription(@Param("keyword") String keyword, Pageable pageable);

    // ✅ 제목 검색 (리스트 전용 → SearchService에서 사용)
    List<GalleryImg> findByTitleContainingIgnoreCase(String keyword);
}
