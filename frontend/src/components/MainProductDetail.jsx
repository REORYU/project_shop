// src/components/MainProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageUploadForm from "./ImageUploadForm"; // ✅ 새로 추가
import "../styles/mainProductDetail.css";

function MainProductDetail({ user }) {
  const { id } = useParams(); // URL에서 상품 ID 가져오기
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 상품 상세 + 이미지 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`/api/mainproduct/${id}`);
        setProduct(productRes.data);

        const imagesRes = await axios.get(`/api/mainproduct/${id}/images`);
        setImages(imagesRes.data);
      } catch (err) {
        console.warn("백엔드 API 응답 없음 → 더미 데이터 사용");
        // 👉 더미 데이터 fallback
        setProduct({
          id,
          title: "테스트 상품 " + id,
          description: "이 상품은 백엔드 연결 전이라 더미 데이터로 표시됩니다.",
          imagePaths: ["https://via.placeholder.com/600x300?text=Main+Product+" + id],
        });
        setImages([
          { id: 1, imgUrl: "https://via.placeholder.com/400x250?text=Detail+Image+1" },
          { id: 2, imgUrl: "https://via.placeholder.com/400x250?text=Detail+Image+2" },
        ]);
      }
    };
    fetchData();
  }, [id]);

  if (!product) return <p className="loading">상품 정보를 불러오는 중...</p>;

  return (
    <div className="mpd-page">
      {/* 대표 이미지 */}
      <div className="mpd-main-image">
        <img
          src={
            product.imagePaths && product.imagePaths.length > 0
              ? product.imagePaths[0]
              : "https://via.placeholder.com/600x300?text=No+Image"
          }
          alt={product.title}
        />
      </div>

      {/* 상세 이미지들 */}
      <div className="mpd-detail-images">
        {images.map((img) => (
          <div key={img.id} className="mpd-detail-image-box">
            <img
              src={img.imgUrl || "https://via.placeholder.com/400x250?text=No+Image"}
              alt="상세 이미지"
            />
          </div>
        ))}
      </div>

      {/* 설명 영역 */}
      <div className="mpd-description">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
      </div>

      {/* + 이미지추가하기 버튼 (관리자만) */}
      {user?.email === "yousung70@nate.com" && (
        <div className="mpd-add-btn-wrapper">
          <button className="btn-gold" onClick={() => setIsModalOpen(true)}>
            + 이미지 추가하기
          </button>
        </div>
      )}

      {/* 모달 */}
      {isModalOpen && (
        <div className="mpd-modal-overlay">
          <div className="mpd-modal">
            {/* ✅ ImageUploadForm 재사용 */}
            <ImageUploadForm
              productId={id}
              onSuccess={() => {
                setIsModalOpen(false);
                window.location.reload();
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainProductDetail;
