import React from "react";
import { useParams } from "react-router-dom";
import "../styles/mainTab.css"; // ✅ 디자인 파일 (기존 유지)

function MainTabDetail() {
  const { id } = useParams();

  return (
    <div className="main-tab-detail">
      <h1 className="section-title">메인탭 상세 페이지</h1>
      <p>현재 선택된 메인탭 ID: {id}</p>

      {/* ✅ 추후: 갤러리/상품/음원 등 UI 확장 */}
      <div className="detail-placeholder">
        이곳에 해당 메인탭 전용 콘텐츠가 표시됩니다.
      </div>
    </div>
  );
}

export default MainTabDetail;
