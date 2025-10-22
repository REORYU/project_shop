// src/components/GalleryList.jsx
import React from "react";
import "../styles/GalleryDetail.css"; 
import TabGroupButtons from "./TabGroupButtons"; // ✅ 버튼 추가

function GalleryList() {
  // ✅ 더미 데이터 배열
  const samples = [
    {
      id: 1,
      title: "Classic50 Music Stand",
      imgUrl: "/images/sample1.jpg",
      description: `
        <ul>
          <li>Black 색상의 Classic Style 보면대</li>
          <li>특수 Polymer 재질</li>
          <li>높이 조절: 64~124cm</li>
          <li>무게: 2.5kg</li>
        </ul>
      `,
      layout: "horizontal",
    },
    {
      id: 2,
      title: "Stage Shell Setup",
      imgUrl: "/images/sample2.jpg",
      description: `
        <ul>
          <li>설치 장소로 이동</li>
          <li>간단한 설치 단계</li>
          <li>빠른 접이식 구조</li>
        </ul>
      `,
      layout: "vertical",
    },
  ];

  return (
    <div className="gallery-list-wrapper">
      {/* ✅ 상단 버튼 */}
      <TabGroupButtons />

      {/* ✅ 리스트 출력 */}
      {samples.map((image) => {
        const hasDescription =
          image.description && image.description.trim() !== "";

        return (
          <div
            key={image.id}
            className={`gallery-detail-card ${image.layout} ${
              hasDescription ? "with-desc" : "no-desc"
            }`}
          >
            {/* 이미지 */}
            <div className="gallery-detail-image">
              <img src={image.imgUrl} alt={image.title} />
            </div>

            {/* 설명 */}
            {hasDescription && (
              <div className="gallery-detail-info">
                <h2 className="gallery-detail-title">{image.title}</h2>
                <div
                  className="gallery-detail-text"
                  dangerouslySetInnerHTML={{ __html: image.description }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GalleryList;
