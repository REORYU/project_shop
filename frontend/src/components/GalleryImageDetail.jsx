import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/theme-gold.css";
import "../App.css";

function GalleryImageDetail() {
  const { id } = useParams(); // ✅ /gallery/image/:id 에서 id 받기
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ 이미지 상세 조회
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    axios
      .get(`/api/gallery/${id}`) // 백엔드에서 개별 이미지 가져오는 API 필요
      .then((res) => {
        setImage(res.data);
      })
      .catch((err) => {
        console.error("이미지 상세 불러오기 실패:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>불러오는 중...</p>;
  }

  if (!image) {
    return <p>이미지를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="gallery-detail-page">
      {/* 제목 */}
      <h2 className="gallery-title">{image.title}</h2>

      {/* 이미지 + 설명 레이아웃 */}
      <div className="gallery-detail-wrapper">
        {/* 이미지 */}
        <div className="gallery-detail-left">
          <img
            src={image.imgUrl}
            alt={image.title}
            className="gallery-detail-image"
          />
        </div>

        {/* 설명 */}
        <div
          className="gallery-detail-info"
          dangerouslySetInnerHTML={{ __html: image.description }}
        />
      </div>
    </div>
  );
}

export default GalleryImageDetail;
