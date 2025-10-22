package com.example.backend.repository;

import com.example.backend.domain.MainTab;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MainTabRepository extends JpaRepository<MainTab, Long> {

    /**
     * ✅ 정렬 순서 기준 오름차순 조회 (페이징 포함)
     *    sortOrder ASC, 같은 값일 경우 id ASC
     */
    Page<MainTab> findAllByOrderBySortOrderAscIdAsc(Pageable pageable);

    /**
     * ✅ 정렬 순서 기준 오름차순 조회 (페이징 없이 전체)
     *    sortOrder ASC, 같은 값일 경우 id ASC
     */
    List<MainTab> findAllByOrderBySortOrderAscIdAsc();

    /**
     * ✅ 현재 가장 큰 sortOrder 값 조회
     *    신규 등록 시 (max + 1) 부여에 사용
     *    데이터 없을 경우 null 반환
     */
    @Query("SELECT MAX(m.sortOrder) FROM MainTab m")
    Integer findMaxSortOrder();
}
