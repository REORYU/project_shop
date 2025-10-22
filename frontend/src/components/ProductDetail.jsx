import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/productDetail.css";

function ProductDetail({ user }) {
  const { id } = useParams(); // URL에서 상품 ID 가져옴
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ 상세 데이터 가져오기
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("상품 상세 불러오기 실패:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="loading">불러오는 중...</p>;
  if (!product) return <p className="no-data">상품 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="product-detail-page">
      {/* 상품명 */}
      <h2 className="product-title">{product.title}</h2>

      <div className="product-detail-wrapper">
        {/* 왼쪽: 상품 이미지 */}
        <div className="product-detail-img">
          {product.imgUrl ? (
            <img src={product.imgUrl} alt={product.title} />
          ) : (
            <div className="no-img">이미지 없음</div>
          )}
        </div>

        {/* 오른쪽: 설명 */}
        <div className="product-detail-info">
          <h3 className="info-title">📘 제품설명</h3>
          <p className="product-desc">
            {product.description ? product.description : "설명 없음"}
          </p>

          {/* 등록일 */}
          <p className="product-meta">등록일: {product.regTime}</p>

          {/* ✅ 이미지 추가 버튼 (특정 계정만 보이도록) */}
          {user?.email === "yousung70@nate.com" && (
            <button type="button" className="btn-secondary">
              + 이미지 추가하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
