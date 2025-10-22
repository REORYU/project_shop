// src/components/MainAchievements.jsx
import React from "react";
import "../styles/MainAchievements.css";

function MainAchievements() {
  return (
    <div className="achievements-section">
      {/* 제목 */}
      <h2 className="achievements-title">
        2013~현재 (주요실적)
        <span> Results of Business</span>
      </h2>

      {/* 1. 공공기관 */}
      <div className="achievements-block">
        <h3>1. 공공기관</h3>
        <div className="achievements-img-wrapper">
          <img
            src="/images/1_1.jpg"
            alt="공공기관 주요실적"
            className="achievements-img"
          />
        </div>
      </div>

      {/* 2. 대학교 */}
      <div className="achievements-block">
        <h3>2. 대학교</h3>
        <div className="achievements-img-wrapper">
          <img
            src="/images/1_2.jpg"
            alt="대학교 주요실적"
            className="achievements-img"
          />
        </div>
      </div>

      {/* 3. 기타 연주홀 및 대형교회 */}
      <div className="achievements-block">
        <h3>3. 기타 연주홀 및 대형교회</h3>
        <div className="achievements-img-wrapper">
          <img
            src="/images/1_3.jpg"
            alt="기타 연주홀 및 대형교회 주요실적"
            className="achievements-img"
          />
        </div>
      </div>
    </div>
  );
}

export default MainAchievements;
