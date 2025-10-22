package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        System.out.println("✅ WebConfig 실행됨: 정적 리소스 매핑 등록 시작");

        // ✅ React 정적 리소스 (React build 폴더 전체를 정적 자원으로 설정)
        registry.addResourceHandler("/**")
                .addResourceLocations("file:/home/sunmin/build/")
                .setCachePeriod(0);

        System.out.println("➡ 매핑 추가: /** → /home/sunmin/build/");

        // ✅ 갤러리 이미지
        registry.addResourceHandler("/images/gallery/**")
                .addResourceLocations("file:/home/sunmin/gallery/")
                .setCachePeriod(0);

        // ✅ 상품 이미지
        registry.addResourceHandler("/images/item/**")
                .addResourceLocations("file:/home/sunmin/item/")
                .setCachePeriod(0);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // ✅ React SPA 라우팅
        registry.addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
    }
}
