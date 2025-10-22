import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ 전역 스타일
import "./styles/theme-gold.css";
import "./App.css";

// ================= 공통 컴포넌트 =================
import Header from "./components/Header";
import Footer from "./components/Footer";

// ================= 회원/로그인 관련 =================
import Register from "./components/Register";
import Login from "./components/Login";

// ================= 메뉴 관리 =================
import MenuManager from "./components/MenuManager";
import MenuNew from "./components/MenuNew";
import MenuList from "./components/MenuList";
import MenuEdit from "./components/MenuEdit";

// ================= 탭 그룹 관리 =================
import TabGroupNew from "./components/TabGroupNew";
import TabGroupList from "./components/TabGroupList";
import TabGroupEdit from "./components/TabGroupEdit";

// ================= 갤러리 관리 =================
import ImageUpload from "./components/ImageUpload";
import GalleryManage from "./components/GalleryManage";
import GalleryDetail from "./components/GalleryDetail";
import GalleryList from "./components/GalleryList";
import GalleryImageDetail from "./components/GalleryImageDetail";

// ================= 메인탭 관리 =================
import MainTabNew from "./components/MainTabNew";
import MainTabList from "./components/MainTabList";
import MainTabDetail from "./components/MainTabDetail";

// ================= 상품 관리 =================
import ProductNew from "./components/ProductNew";
import MainProductManage from "./components/MainProductManage";
import ProductDetail from "./components/ProductDetail";

// ================= 메인상품 상세 =================
import MainProductDetail from "./components/MainProductDetail"; // ✅ 추가

// ================= 사용자 메인 페이지 =================
import MainPage from "./components/MainPage";

// ================= 검색 결과 =================
import SearchResult from "./components/SearchResult";

// ================= API 연결 테스트 =================
import TestApi from "./components/TestApi";

function App() {
  const savedUser = localStorage.getItem("user");
  const [isLoggedIn, setIsLoggedIn] = useState(!!savedUser);
  const [role, setRole] = useState(
    savedUser ? JSON.parse(savedUser).role || "USER" : ""
  );
  const [currentUser, setCurrentUser] = useState(
    savedUser ? JSON.parse(savedUser) : null
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setRole(parsed.role || "USER");
        setCurrentUser(parsed);
      } catch (e) {
        console.error("localStorage 파싱 오류:", e);
      }
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          role={role}
        />

        <main>
          <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<MainPage />} />

            {/* 검색 결과 */}
            <Route path="/search" element={<SearchResult />} />

            {/* 회원/로그인 */}
            <Route path="/register" element={<Register />} />
            <Route
              path="/login"
              element={
                <Login
                  setIsLoggedIn={setIsLoggedIn}
                  setRole={setRole}
                  setCurrentUser={setCurrentUser}
                />
              }
            />

            {/* 메뉴 관리 */}
            <Route path="/menu/manage" element={<MenuManager />} />
            <Route path="/menu/new" element={<MenuNew />} />
            <Route path="/menu/list" element={<MenuList />} />
            <Route path="/menu/edit/:id" element={<MenuEdit />} />

            {/* 탭 그룹 관리 */}
            <Route path="/tabgroup/new" element={<TabGroupNew />} />
            <Route path="/tabgroup/list" element={<TabGroupList />} />
            <Route path="/tabgroup/edit/:id" element={<TabGroupEdit />} />

            {/* 갤러리 관리 */}
            <Route path="/gallery/upload" element={<ImageUpload />} />
            <Route path="/gallery/manage" element={<GalleryManage />} />
            <Route
              path="/gallery/:menuId"
              element={
                <GalleryDetail
                  currentUser={currentUser}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route path="/gallery/test" element={<GalleryList />} />
            <Route path="/gallery/image/:id" element={<GalleryImageDetail />} />

            {/* 메인탭 관리 */}
            <Route path="/main-tab/new" element={<MainTabNew />} />
            <Route path="/main-tab/list" element={<MainTabList />} />
            <Route path="/main-tab/:id" element={<MainTabDetail />} />

            {/* 상품 관리 */}
            <Route path="/product/new" element={<ProductNew />} />
            <Route path="/main-products" element={<MainProductManage />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* 메인상품 상세 */}
            <Route
              path="/mainproduct/:id"
              element={<MainProductDetail user={currentUser} />}
            />{/* ✅ 추가 */}

            {/* API 연결 테스트 */}
            <Route path="/test-api" element={<TestApi />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
