package com.example.backend.service;

import com.example.backend.domain.MainTab;
import com.example.backend.repository.MainTabRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MainTabService {

    private final MainTabRepository mainTabRepository;

    /**
     * ✅ 메인탭 페이징 조회 (정렬순: sortOrder ASC, id ASC 보조정렬)
     */
    @Transactional(readOnly = true)
    public Page<MainTab> getAllSorted(Pageable pageable) {
        return mainTabRepository.findAllByOrderBySortOrderAscIdAsc(pageable);
    }

    /**
     * ✅ 메인탭 전체 조회 (정렬순: sortOrder ASC, id ASC 보조정렬)
     */
    @Transactional(readOnly = true)
    public List<MainTab> getAllNoPaging() {
        return mainTabRepository.findAllByOrderBySortOrderAscIdAsc();
    }

    /**
     * ✅ 단일 메인탭 조회
     */
    @Transactional(readOnly = true)
    public MainTab getById(Long id) {
        return mainTabRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 메인탭이 존재하지 않습니다. id=" + id));
    }

    /**
     * ✅ 메인탭 등록
     * - sortOrder 자동 부여 (최댓값 + 1)
     */
    public MainTab create(MainTab mainTab) {
        Integer maxSort = mainTabRepository.findMaxSortOrder();
        if (maxSort == null) {
            maxSort = 0;
        }
        mainTab.setSortOrder(maxSort + 1);
        return mainTabRepository.save(mainTab);
    }

    /**
     * ✅ 메인탭 수정
     * - sortOrder가 null로 들어오면 기존 값 유지
     */
    public MainTab update(Long id, MainTab updated) {
        MainTab existing = getById(id);

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());

        if (updated.getSortOrder() != null) {
            existing.setSortOrder(updated.getSortOrder());
        }

        existing.setModifiedBy(updated.getModifiedBy());

        return mainTabRepository.save(existing);
    }

    /**
     * ✅ 메인탭 삭제
     */
    public void delete(Long id) {
        mainTabRepository.deleteById(id);
    }

    /**
     * ✅ 정렬 순서 저장 (컨트롤러에서 호출)
     */
    public void updateSortOrder(Long id, int sortOrder) {
        MainTab existing = mainTabRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("메인탭 없음 id=" + id));
        existing.setSortOrder(sortOrder);
        mainTabRepository.save(existing);
    }
}
