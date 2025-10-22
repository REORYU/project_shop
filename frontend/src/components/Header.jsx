import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/theme-gold.css";
import "../App.css";

function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("user"); // ✅ user 전체 제거
  };

  // ✅ 로그인 시 저장된 user 정보 가져오기
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = isLoggedIn && user && user.email === "yousung70@nate.com";

  // ✅ 검색 실행
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(search)}`);
    setSearch("");
  };

  return (
    <header className="header">
      {/* 왼쪽: 로고 + 검색창 */}
      <div className="left-section">
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <strong>SUNMIN SPS</strong>
          </Link>
        </div>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" aria-label="검색">
            🔍
          </button>
        </form>
      </div>

      {/* 오른쪽: 메뉴 + 버튼 */}
      <div className="right-nav">
        {isAdmin && (
          <nav className="admin-menu">
            <Link to="/menu/new">메뉴 등록</Link>
            <Link to="/menu/list">메뉴 관리</Link>
            <Link to="/tabgroup/new">탭 그룹 등록</Link>
            <Link to="/tabgroup/list">탭 그룹 관리</Link>
            <Link to="/gallery/upload">갤러리 등록</Link>
            <Link to="/gallery/manage">갤러리 관리</Link>
            {/* ✅ 새로 추가된 메인탭 메뉴 */}
            <Link to="/main-tab/new">메인탭 등록</Link>
            <Link to="/main-tab/list">메인탭 관리</Link>
            <Link to="/product/new">메인상품등록</Link>
            <Link to="/main-products">메인상품관리</Link>
          </nav>
        )}

        <div className="nav-buttons">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn-gold">로그인</Link>
              <Link to="/register" className="btn-gold" style={{ marginLeft: "8px" }}>
                회원가입
              </Link>
            </>
          ) : (
            <button className="btn-gold" onClick={handleLogout}>
              로그아웃
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
