import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/MenuList.css";

function MenuList() {
  const [menuData, setMenuData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name"); // 기본 검색: 이름
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // ✅ 서버에서 메뉴 목록 불러오기
  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/menu/list");
      setMenuData(res.data || []);
    } catch (err) {
      console.error("메뉴 불러오기 실패:", err);
      setMenuData([]);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // ✅ parentId → 상위 메뉴 이름 매핑
  const menuMap = useMemo(() => {
    const map = {};
    menuData.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, [menuData]);

  // ✅ 메뉴 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/menu/${id}`);
      alert("삭제 완료");
      fetchMenus();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  // ✅ 검색 필터
  const filteredData = menuData.filter((menu) => {
    const fieldMap = {
      name: menu.name || "",
      depth: menu.depth?.toString() || "",
      order: menu.orderNum?.toString() || "",
      created: menu.regTime || "",
    };

    const value = fieldMap[searchField]?.toLowerCase() || "";
    return value.includes(searchTerm.toLowerCase());
  });

  // ✅ 페이징 처리
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="page-container">
      <div className="card">
        {/* 제목 + 검색 */}
        <div className="list-header">
          <h2>📋 등록된 메뉴 목록</h2>
          <div className="search-controls">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="search-select"
            >
              <option value="name">이름</option>
              <option value="depth">단계</option>
              <option value="order">순서</option>
              <option value="created">등록일</option>
            </select>
            <input
              type="text"
              placeholder="검색어 입력..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>
        </div>

        {/* 테이블 */}
        <table className="menu-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>순번</th>
              <th style={{ width: "250px" }}>대분류</th>
              <th style={{ width: "250px" }}>중분류</th>
              <th style={{ width: "80px" }}>단계</th>
              <th style={{ width: "80px" }}>순서</th>
              <th style={{ width: "120px" }}>등록일</th>
              <th style={{ width: "120px" }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((menu, idx) => (
                <tr key={menu.id}>
                  {/* 순번 */}
                  <td>{startIndex + idx + 1}</td>
                  {/* 대분류 이름 (depth=1 → 자기자신, depth=2 → parentId 기준) */}
                  <td>{menu.depth === 1 ? menu.name : menuMap[menu.parentId] || "-"}</td>
                  {/* 중분류 이름 (depth=2일 때만) */}
                  <td>{menu.depth === 2 ? menu.name : "-"}</td>
                  <td>{menu.depth}</td>
                  <td>{menu.orderNum}</td>
                  <td>{menu.regTime ? menu.regTime.split("T")[0] : "-"}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/menu/edit/${menu.id}`)}
                    >
                      수정
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(menu.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">등록된 메뉴가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 페이징 */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ◀ 이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            다음 ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuList;
