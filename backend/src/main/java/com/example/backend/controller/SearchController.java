package com.example.backend.controller;

import com.example.backend.dto.SearchResultDto;
import com.example.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    /**
     * 🔍 검색 API
     * 프론트에서 /api/search?keyword=xxx 로 호출
     */
    @GetMapping("/search")
    public ResponseEntity<List<SearchResultDto>> search(@RequestParam String keyword) {
        List<SearchResultDto> results = searchService.searchAll(keyword);
        return ResponseEntity.ok(results);
    }
}
