import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MegaMenu from "./MegaMenu";
import GalleryDetail from "./GalleryDetail";
import MainAchievements from "./MainAchievements";
import "../styles/mainPage.css";

function MainPage() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [activeSection, setActiveSection] = useState("products"); // ✅ products | achievements
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 12;

  // ✅ 상품 불러오기
  const loadPage = useCallback(
    async (tabId, pageNum = 0) => {
      if (!tabId) return;
      try {
        const res = await axios.get("/api/mainproduct/list", {
          params: { mainTabId: tabId, page: pageNum, size },
        });
        setProducts(res.data.content || []);
        setPage(pageNum);
        setTotalPages(res.data.totalPages || 0);
      } catch (err) {
        console.error("상품 불러오기 실패:", err);
        setProducts([]);
        setPage(0);
        setTotalPages(0);
      }
    },
    [size]
  );

  // ✅ 메인탭 불러오기
  useEffect(() => {
    axios
      .get("/api/maintab", { params: { sort: "sortOrder" } })
      .then((res) => {
        const content = res.data?.content || [];
        const sorted = [...content].sort((a, b) => a.sortOrder - b.sortOrder);
        setTabs(sorted);

        if (sorted.length > 0) {
          setActiveTab(sorted[0].id);
          setActiveSection("products"); // 처음은 상품 모드
          loadPage(sorted[0].id, 0);
        }
      })
      .catch((err) => console.error("메인탭 불러오기 실패:", err));
  }, [loadPage]);

  // ✅ 탭 클릭
  const handleTabClick = (tab) => {
    if (tab.name === "주요실적") {
      setActiveSection("achievements");
      setActiveTab(tab.id);
      setProducts([]);
    } else {
      setActiveSection("products");
      setActiveTab(tab.id);
      loadPage(tab.id, 0);
    }
  };

  return (
    <div className="main-page">
      {/* ✅ 기가메뉴 */}
      <section className="mega-menu-section">
        <MegaMenu onMenuSelect={(menu) => setSelectedMenu(menu)} />
      </section>

      {selectedMenu ? (
        <section className="gallery-detail-section">
          <GalleryDetail
            menuId={selectedMenu.id}
            menuName={selectedMenu.name}
          />
        </section>
      ) : (
        <section className="main-content">
          {/* ✅ 메인탭 버튼 */}
          <div className="main-tab-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* ✅ 주요실적 */}
          {activeSection === "achievements" && <MainAchievements />}

          {/* ✅ 상품 카드 그리드 */}
          {activeSection === "products" && products.length > 0 && (
            <div className="product-grid">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="product-card"
                  style={{ cursor: "pointer" }}
                >
                  <img src={p.thumbnail} alt={p.name} loading="lazy" />
                  <h4>{p.name}</h4>
                  <p>{p.price.toLocaleString()}원</p>
                </div>
              ))}
            </div>
          )}

          {/* ✅ 페이징 */}
          {activeSection === "products" && totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => loadPage(activeTab, Math.max(page - 1, 0))}
                disabled={page === 0}
              >
                ◀ 이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={page === i ? "active" : ""}
                  onClick={() => loadPage(activeTab, i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  loadPage(activeTab, Math.min(page + 1, totalPages - 1))
                }
                disabled={page === totalPages - 1}
              >
                다음 ▶
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default MainPage;
