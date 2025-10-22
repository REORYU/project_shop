import React from "react";
import GalleryDetail from "./GalleryDetail";
import "../styles/galleryMain.css";

function TabGroupButtons() {
  // ✅ 샘플 탭 그룹
  const tabGroups = [
    { id: 7, name: "Wenger Stands" },
    { id: 8, name: "일반보면대" },
    { id: 9, name: "지휘자용보면대" },
  ];

  // ✅ 샘플 데이터 (각 그룹에 맞는 이미지/설명)
  const galleryData = {
    7: {
      title: "Classic50 Music Stand",
      imgUrl: "/images/sample1.jpg",
      description: `
        <h3>제품 설명</h3>
        <ul>
          <li>Black 색상의 Classic Style 보면대</li>
          <li>특수 Polymer 재질</li>
          <li>높이 조절: 64~124cm</li>
          <li>무게: 2.5kg</li>
        </ul>
      `,
    },
    8: {
      title: "일반 보면대",
      imgUrl: "/images/sample2.jpg",
      description: "", // 설명 없음
    },
    9: {
      title: "지휘자용 보면대",
      imgUrl: "/images/sample1.jpg",
      description: `
        <h3>제품 설명</h3>
        <p>넓은 지휘자용 상판</p>
        <p>높이 조절 가능</p>
      `,
    },
  };

  return (
    <div className="tab-group-wrapper">
      {/* 상단 제목 */}
      <h2 className="gallery-title">[보면대 (Music Stand)]</h2>

      {/* 버튼 목록 */}
      <div className="tab-list">
        {tabGroups.map((tab) => (
          <button key={tab.id} className="tab-button">
            {tab.name}
          </button>
        ))}
      </div>

      {/* 버튼과 상관없이, 모든 갤러리 상세를 순서대로 출력 */}
      <div className="gallery-list">
        {tabGroups.map((tab) => (
          <GalleryDetail key={tab.id} data={galleryData[tab.id]} />
        ))}
      </div>
    </div>
  );
}

export default TabGroupButtons;
