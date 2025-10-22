import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GalleryDetail from "./GalleryDetail"; 
import ProductDetail from "./ProductDetail"; 
import "../styles/theme-gold.css";
import "../App.css";

function SearchResult() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ 검색 실행
  useEffect(() => {
    if (!keyword) return;
    setLoading(true);

    axios
      .get(`/api/search?keyword=${encodeURIComponent(keyword)}`)
      .then((res) => {
        setResults(res.data || []);
      })
      .catch((err) => {
        console.error("검색 요청 실패:", err);
      })
      .finally(() => setLoading(false));
  }, [keyword]);

  // ✅ 결과가 딱 1개 → 상세페이지처럼 출력
  if (!loading && results.length === 1) {
    const item = results[0];
    if (item.type === "PRODUCT") {
      return <ProductDetail id={item.id} />;
    } else {
      return <GalleryDetail menuId={item.id} />; // ✅ gallery도 id 사용
    }
  }

  return (
    <div className="search-page">
      <h2 className="search-title">
        🔍 검색 결과: <span className="keyword">"{keyword}"</span>
      </h2>

      {loading && <p>검색 중...</p>}

      {!loading && results.length === 0 && (
        <p className="no-result">검색 결과가 없습니다.</p>
      )}

      {/* 여러 개일 때만 카드 목록 출력 */}
      <div className="search-results">
        {results.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="search-card"
            onClick={() => {
              if (item.type === "PRODUCT") {
                navigate(`/product/${item.id}`);
              } else {
                navigate(`/gallery/${item.id}`);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            {item.imgUrl && (
              <img src={item.imgUrl} alt={item.title} className="search-img" />
            )}
            <div className="search-info">
              <h3>{item.title}</h3>
              <span className="badge">
                {item.type === "PRODUCT" ? "메인상품" : "갤러리"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResult;
