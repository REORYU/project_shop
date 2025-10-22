package com.example.backend.service;

import com.example.backend.domain.GalleryImg;
import com.example.backend.dto.GalleryImgDto;
import com.example.backend.dto.GalleryManageDto;
import com.example.backend.dto.GalleryOrderUpdateDto;
import com.example.backend.repository.GalleryImgRepository;
import com.example.backend.repository.MenuRepository;
import com.example.backend.repository.TabGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GalleryImgService {

    private final GalleryImgRepository galleryImgRepository;
    private final MenuRepository menuRepository;
    private final TabGroupRepository tabGroupRepository;

    @Value("${galleryImgLocation}")   // application.yml -> galleryImgLocation: C:/shop/gallery
    private String galleryPath;

    // ✅ DTO 저장
    public GalleryImgDto save(GalleryImgDto dto) {
        GalleryImg img = new GalleryImg();
        img.setImgUrl(dto.getImgUrl());
        img.setTitle(dto.getTitle());
        img.setDescription(dto.getDescription());
        img.setMenuId(dto.getMenuId());
        img.setTabGroupId(dto.getTabGroupId());
        img.setSortOrder(dto.getSortOrder());
        img.setDetailContent(dto.isDetailContent());
        img.setLandscape(dto.isLandscape());
        img.setWidth(dto.getWidth());
        img.setHeight(dto.getHeight());
        img.setRegTime(LocalDateTime.now());

        GalleryImg saved = galleryImgRepository.save(img);
        return GalleryImgDto.fromEntity(saved);
    }

    // ✅ 파일 업로드 + DB 저장
    public GalleryImgDto saveImage(MultipartFile file,
                                   Long menuId,
                                   Long tabGroupId,
                                   String description,
                                   boolean isDetailContent) throws IOException {

        File dir = new File(galleryPath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String oriImgName = file.getOriginalFilename();
        String ext = "";
        if (oriImgName != null && oriImgName.contains(".")) {
            ext = oriImgName.substring(oriImgName.lastIndexOf("."));
        }
        String savedFileName = UUID.randomUUID() + ext;

        File dest = new File(galleryPath, savedFileName);
        file.transferTo(dest);

        BufferedImage bufferedImage = ImageIO.read(dest);
        int width = bufferedImage.getWidth();
        int height = bufferedImage.getHeight();
        boolean isLandscape = width >= height;

        int maxSort = 0;
        List<GalleryImg> existingImgs =
                (tabGroupId != null)
                        ? galleryImgRepository.findByMenuIdAndTabGroupId(menuId, tabGroupId)
                        : galleryImgRepository.findByMenuId(menuId);

        if (!existingImgs.isEmpty()) {
            maxSort = existingImgs.stream()
                    .mapToInt(GalleryImg::getSortOrder)
                    .max()
                    .orElse(0);
        }

        GalleryImg img = new GalleryImg();
        img.setOriImgName(oriImgName);
        img.setImgName(savedFileName);
        img.setImgUrl("/images/gallery/" + savedFileName);
        img.setMenuId(menuId);
        img.setTabGroupId(tabGroupId);
        img.setDescription(description);
        img.setDetailContent(isDetailContent);
        img.setLandscape(isLandscape);
        img.setWidth(width);
        img.setHeight(height);
        img.setRegTime(LocalDateTime.now());
        img.setSortOrder(maxSort + 1);

        GalleryImg saved = galleryImgRepository.save(img);

        return GalleryImgDto.fromEntity(saved);
    }

    // ✅ 특정 메뉴/탭 그룹 기준 이미지 목록 조회
    public List<GalleryImgDto> getImgs(Long menuId, Long tabGroupId) {
        List<GalleryImg> imgs;

        if (tabGroupId != null) {
            imgs = galleryImgRepository.findByMenuIdAndTabGroupId(menuId, tabGroupId);
        } else {
            imgs = galleryImgRepository.findByMenuId(menuId);
        }

        return imgs.stream()
                .map(GalleryImgDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ✅ 전체 목록 조회 (페이징)
    public Page<GalleryManageDto> getAllImages(Pageable pageable) {
        return galleryImgRepository.findAll(pageable)
                .map(this::convertToManageDto);
    }

    // ✅ 검색 지원 (field + keyword)
    public Page<GalleryManageDto> getAllImages(Pageable pageable, String field, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllImages(pageable);
        }

        Page<GalleryImg> result;

        switch (field) {
            case "menuMainName" -> result = galleryImgRepository.searchByMenuMainName(keyword, pageable);
            case "menuSubName" -> result = galleryImgRepository.searchByMenuSubName(keyword, pageable);
            case "tabGroupName" -> result = galleryImgRepository.searchByTabGroupName(keyword, pageable);
            case "sortOrder" -> {
                try {
                    int order = Integer.parseInt(keyword);
                    result = galleryImgRepository.findBySortOrder(order, pageable);
                } catch (NumberFormatException e) {
                    result = Page.empty(pageable);
                }
            }
            default -> result = galleryImgRepository.findByTitleContainingIgnoreCase(keyword, pageable);
        }

        return result.map(this::convertToManageDto);
    }

    // ✅ Dto 변환
    private GalleryManageDto convertToManageDto(GalleryImg entity) {
        GalleryManageDto dto = new GalleryManageDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setImgUrl(entity.getImgUrl());
        dto.setSortOrder(entity.getSortOrder());

        // ✅ 원본 필드 추가 (수정 모달에서 필요)
        dto.setMenuId(entity.getMenuId());
        dto.setTabGroupId(entity.getTabGroupId());
        dto.setDetailContent(entity.isDetailContent());
        dto.setWidth(entity.getWidth());
        dto.setHeight(entity.getHeight());

        if (entity.getRegTime() != null) {
            dto.setRegTime(entity.getRegTime().toString());
        }

        if (entity.getMenuId() != null) {
            menuRepository.findById(entity.getMenuId()).ifPresent(menu -> {
                if (menu.getDepth() == 2) {
                    dto.setMenuSubName(menu.getName());
                    if (menu.getParentId() != null) {
                        menuRepository.findById(menu.getParentId())
                                .ifPresent(parent -> dto.setMenuMainName(parent.getName()));
                    }
                } else {
                    dto.setMenuMainName(menu.getName());
                }
            });
        }

        if (entity.getTabGroupId() != null) {
            tabGroupRepository.findById(entity.getTabGroupId())
                    .ifPresent(tab -> dto.setTabGroupName(tab.getName()));
        }

        return dto;
    }

    // ✅ 단일 삭제
    public void delete(Long id) {
        galleryImgRepository.deleteById(id);
    }

    // ✅ 다중 삭제
    public void deleteAll(List<Long> ids) {
        galleryImgRepository.deleteAllById(ids);
    }

    // ✅ 정렬 저장
    public void updateSortOrders(List<GalleryOrderUpdateDto> orderList) {
        for (GalleryOrderUpdateDto dto : orderList) {
            GalleryImg img = galleryImgRepository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("이미지가 존재하지 않습니다. ID=" + dto.getId()));
            img.setSortOrder(dto.getSortOrder());
        }
    }

    // ✅ 수정 (파일 교체 포함)
    public GalleryImg updateImage(Long id,
                                  MultipartFile file,
                                  Long menuId,
                                  Long tabGroupId,
                                  String description,
                                  boolean isDetailContent) throws IOException {

        GalleryImg img = galleryImgRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("이미지가 존재하지 않습니다. ID=" + id));

        // 기존 텍스트/메타데이터 갱신
        img.setMenuId(menuId);
        img.setTabGroupId(tabGroupId);
        img.setDescription(description);
        img.setDetailContent(isDetailContent);

        // 파일이 새로 업로드된 경우 교체
        if (file != null && !file.isEmpty()) {
            File dir = new File(galleryPath);
            if (!dir.exists()) dir.mkdirs();

            String oriImgName = file.getOriginalFilename();
            String ext = "";
            if (oriImgName != null && oriImgName.contains(".")) {
                ext = oriImgName.substring(oriImgName.lastIndexOf("."));
            }
            String savedFileName = UUID.randomUUID() + ext;

            File dest = new File(galleryPath, savedFileName);
            file.transferTo(dest);

            BufferedImage bufferedImage = ImageIO.read(dest);
            int width = bufferedImage.getWidth();
            int height = bufferedImage.getHeight();
            boolean isLandscape = width >= height;

            img.setOriImgName(oriImgName);
            img.setImgName(savedFileName);
            img.setImgUrl("/images/gallery/" + savedFileName);
            img.setWidth(width);
            img.setHeight(height);
            img.setLandscape(isLandscape);
            img.setUpdTime(LocalDateTime.now());
        }

        return img;
    }

    // ✅ 이동
    public void moveImage(Long id, Long newMenuId, Long newTabGroupId) {
        GalleryImg img = galleryImgRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("이미지가 존재하지 않습니다. ID=" + id));

        if (newMenuId != null) img.setMenuId(newMenuId);
        if (newTabGroupId != null) img.setTabGroupId(newTabGroupId);
    }

    // ✅ 단건 조회 (수정 모달에서 사용)
    public GalleryManageDto getImageById(Long id) {
        GalleryImg img = galleryImgRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("이미지가 존재하지 않습니다. ID=" + id));
        return convertToManageDto(img);
    }
}
