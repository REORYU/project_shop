// src/components/TabGroupList.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/TabGroupList.css";

const API_BASE = "http://localhost:8080";

function TabGroupList() {
  const [tabGroups, setTabGroups] = useState([]);
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name"); // 기본 검색: 탭 이름
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTabGroups();
    fetchMenus();
  }, []);

  // ✅ 전체 탭 그룹 조회
  const fetchTabGroups = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/tabgroup`);
      setTabGroups(res.data);
    } catch (err) {
      console.error("탭 그룹 불러오기 실패:", err);
      setError("데이터를 불러오지 못했습니다.");
    }
  };

  // ✅ 메뉴 목록 조회
  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/menu/list`);
      setMenus(res.data || []);
    } catch (err) {
      console.error("메뉴 불러오기 실패:", err);
    }
  };

  // ✅ 메뉴 ID → 이름 변환 맵
  const menuMap = useMemo(() => {
    const map = {};
    menus.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, [menus]);

  // ✅ 삭제
  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${API_BASE}/api/tabgroup/${id}`);
        fetchTabGroups();
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // ✅ 검색 필터
  const filteredData = tabGroups.filter((group) => {
    const fieldMap = {
      name: group.name || "",
      menuId: menuMap[group.menuId] || "",
      subMenuId: menuMap[group.subMenuId] || "",
    };
    const value = fieldMap[searchField]?.toLowerCase() || "";
    return value.includes(searchTerm.toLowerCase());
  });

  // ✅ 페이징 처리
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="tabgroup-list-wrapper">
      {/* 제목 + 검색 */}
      <div className="list-header">
        <h2>📑 탭 그룹 관리</h2>
        <div className="search-controls">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="search-select"
          >
            <option value="name">탭 이름</option>
            <option value="menuId">대분류</option>
            <option value="subMenuId">중분류</option>
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
      <table className="tabgroup-table">
        <thead>
          <tr>
            <th style={{ width: "60px" }}>순번</th>
            <th style={{ width: "200px" }}>대분류</th>
            <th style={{ width: "250px" }}>중분류</th>
            <th style={{ width: "300px" }}>탭 이름</th>
            <th style={{ width: "100px" }}>정렬 순서</th>
            <th style={{ width: "120px" }}>관리</th>
          </tr>
        </thead>

        <tbody>
          {currentData.length > 0 ? (
            currentData.map((group, index) => (
              <tr key={group.id}>
                {/* ✅ 순번 = 현재 페이지 시작 인덱스 + index + 1 */}
                <td>{startIndex + index + 1}</td>
                <td>{menuMap[group.menuId] || "-"}</td>
                <td>{menuMap[group.subMenuId] || "-"}</td>
                <td>{group.name}</td>
                <td>{group.sortOrder}</td>
                <td>
                  <Link to={`/tabgroup/edit/${group.id}`} className="btn-edit">
                    수정
                  </Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(group.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">등록된 탭 그룹이 없습니다.</td>
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
  );
}

export default TabGroupList;
