import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/mainTabAdmin.css";

function MainTabList() {
  const [tabs, setTabs] = useState([]);
  const [searchField, setSearchField] = useState("name");
  const [search, setSearch] = useState("");

  // ✅ 페이징 상태
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ 수정 모달 상태
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // ✅ 날짜 포맷 함수
  const formatDate = (datetime) => {
    if (!datetime) return "-";
    const d = new Date(datetime);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  // ✅ 목록 불러오기
  const fetchTabs = async () => {
    try {
      const res = await axios.get("/api/maintab", {
        params: { page, size, field: searchField, keyword: search },
      });
      setTabs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("메인탭 목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchTabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchField, search]);

  // 🔍 검색
  const handleSearch = () => {
    setPage(0);
    fetchTabs();
  };

  // 🔼 정렬 위로
  const moveUp = (index) => {
    if (index === 0) return;
    const newTabs = [...tabs];
    [newTabs[index - 1], newTabs[index]] = [newTabs[index], newTabs[index - 1]];
    newTabs.forEach((tab, i) => (tab.sortOrder = i + 1));
    setTabs(newTabs);
  };

  // 🔽 정렬 아래로
  const moveDown = (index) => {
    if (index === tabs.length - 1) return;
    const newTabs = [...tabs];
    [newTabs[index + 1], newTabs[index]] = [newTabs[index], newTabs[index + 1]];
    newTabs.forEach((tab, i) => (tab.sortOrder = i + 1));
    setTabs(newTabs);
  };

  // ✅ 이동 (정렬 순서 저장)
  const handleMoveSave = async () => {
    try {
      const orderList = tabs.map((tab) => ({
        id: tab.id,
        sortOrder: tab.sortOrder,
      }));
      await axios.put("/api/maintab/sort", orderList, {
        headers: { "Content-Type": "application/json" },
      });
      alert("순서가 저장되었습니다.");
      fetchTabs();
    } catch (err) {
      console.error("순서 저장 실패:", err);
      alert("순서 저장 중 오류 발생");
    }
  };

  // ✅ 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/maintab/${id}`);
      alert("삭제되었습니다.");
      fetchTabs();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류 발생");
    }
  };

  // ✅ 수정 모달 열기
  const handleEdit = (tab) => {
    setEditData(tab);
    setIsEditOpen(true);
  };

  // ✅ 수정 저장 (🔥 날짜 필드 제거 후 전송)
  const handleUpdate = async () => {
    try {
      const { regTime, updTime, ...payload } = editData; // ✅ 날짜 제외
      await axios.put(`/api/maintab/${editData.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("수정 완료");
      setIsEditOpen(false);
      fetchTabs();
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류 발생");
    }
  };

  return (
    <div className="mt-page">
      <div className="mt-container">
        {/* 헤더 + 검색 */}
        <div className="mt-header">
          <h2>
            📑 메인탭 관리 <small>Main Tab Management</small>
          </h2>
          <div className="mt-search-box">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="name">메인탭</option>
              <option value="description">설명</option>
            </select>
            <input
              type="text"
              placeholder="검색어 입력..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              검색
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <table className="mt-table">
          <thead>
            <tr>
              <th>순번</th>
              <th>순서</th>
              <th>메인탭</th>
              <th>설명</th>
              <th>등록일</th>
              <th>수정일</th>
              <th>정렬</th>
              <th>이동</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {tabs.map((tab, index) => (
              <tr key={tab.id}>
                <td>{page * size + index + 1}</td>
                <td>{tab.sortOrder}</td>
                <td>{tab.name}</td>
                <td>{tab.description || "-"}</td>
                <td>{formatDate(tab.regTime)}</td>
                <td>{formatDate(tab.updTime)}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn-sort" onClick={() => moveUp(index)}>
                      🔼
                    </button>
                    <button
                      className="btn-sort"
                      onClick={() => moveDown(index)}
                    >
                      🔽
                    </button>
                  </div>
                </td>
                <td>
                  <button className="btn btn-move" onClick={handleMoveSave}>
                    이동
                  </button>
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleEdit(tab)}
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(tab.id)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이징 */}
        <div className="mt-pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            ◀ 이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${i === page ? "active" : ""}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            다음 ▶
          </button>
        </div>
      </div>

      {/* 수정 모달 */}
      {isEditOpen && editData && (
        <div className="modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsEditOpen(false)}
            >
              ✖
            </button>
            <h3>메인탭 수정</h3>
            <input
              type="text"
              value={editData.name || ""}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="메인탭 이름"
            />
            <input
              type="text"
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              placeholder="설명"
            />
            <div className="modal-actions">
              <button className="btn-gold" onClick={handleUpdate}>
                저장
              </button>
              <button className="btn-gray" onClick={() => setIsEditOpen(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainTabList;
