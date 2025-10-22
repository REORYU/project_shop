// src/components/ProductGrid.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/productGrid.css";

function ProductGrid({ mainTabId = 1 }) {
  // ✅ 기본 mainTabId를 Best상품 탭으로 고정 (예: id=1)
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0); // 👉 백엔드 페이지는 0부터 시작
  const [totalPages, setTotalPages] = useState(0);
  const size = 16; // ✅ 항상 4x4

  // ✅ 상품 불러오기
  useEffect(() => {
    axios
      .get("/api/mainproduct/list", {
        params: { mainTabId, page, size },
      })
      .then((res) => {
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch((err) => {
        console.error("상품 목록 불러오기 실패:", err);
      });
  }, [mainTabId, page]);

  // ✅ 카드 부족하면 placeholder 채우기
  const filledProducts = [
    ...products,
    ...Array(size - products.length).fill(null),
  ];

  return (
    <div className="product-grid-wrapper">
      <h2 className="section-title">🔥 Best 상품</h2>

      <div className="product-grid">
        {filledProducts.map((p, idx) =>
          p ? (
            <div
              key={p.id}
              className="product-card"
              onClick={() => navigate(`/mainproduct/${p.id}`)}
              style={{ cursor: "pointer" }}
            >
              {/* 대표 이미지 */}
              <img
                src={p.imagePaths?.[0] || "/images/no-image.png"}
                alt={p.title}
                className="product-img"
              />

              {/* 상품 정보 */}
              <div className="product-info">
                <h3 className="product-name">{p.title}</h3>
                <p className="product-price">
                  {p.price.toLocaleString()}원
                </p>
              </div>
            </div>
          ) : (
            <div key={`empty-${idx}`} className="product-card empty"></div>
          )
        )}
      </div>

      {/* ✅ 페이징 */}
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i ? "active" : ""}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default ProductGrid;
