// src/components/GalleryManage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/galleryAdmin.css";

function GalleryManage() {
  const [images, setImages] = useState([]);
  const [searchField, setSearchField] = useState("menuMainName");
  const [search, setSearch] = useState("");

  // ✅ 페이징 상태
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ 모달 상태
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // ✅ 체크박스 상태
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // ✅ 메뉴/탭 그룹
  const [menus, setMenus] = useState([]);
  const [tabGroups, setTabGroups] = useState([]);

  // ✅ DB에서 목록 가져오기
  const fetchImages = async () => {
    try {
      const res = await axios.get(
        `/api/gallery/manage/list?page=${page}&size=${size}&field=${searchField}&keyword=${search}`
      );
      setImages(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setSelectedIds([]);
      setSelectAll(false);
    } catch (err) {
      console.error("갤러리 목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchField]);

  // 🔍 검색 실행
  const handleSearch = () => {
    setPage(0);
    fetchImages();
  };

  // 🔼 정렬 위로
  const moveUp = (index) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [
      newImages[index],
      newImages[index - 1],
    ];
    setImages(newImages.map((img, i) => ({ ...img, sortOrder: i + 1 })));
  };

  // 🔽 정렬 아래로
  const moveDown = (index) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index + 1], newImages[index]] = [
      newImages[index],
      newImages[index + 1],
    ];
    setImages(newImages.map((img, i) => ({ ...img, sortOrder: i + 1 })));
  };

  // ✅ 정렬 저장
  const handleSaveOrder = async () => {
    try {
      const orderList = images.map((img, idx) => ({
        id: img.id,
        sortOrder: idx + 1,
      }));
      await axios.post("/api/gallery/manage/updateOrder", orderList);
      alert("정렬 순서가 저장되었습니다.");
      fetchImages();
    } catch (err) {
      console.error("정렬 저장 실패:", err);
      alert("정렬 저장 중 오류 발생");
    }
  };

  // ✅ 체크박스
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(images.map((img) => img.id));
    }
    setSelectAll(!selectAll);
  };

  // ✅ 단일 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/gallery/manage/${id}`);
      alert("삭제되었습니다.");
      fetchImages();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류 발생");
    }
  };

  // ✅ 선택 삭제
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("삭제할 이미지를 선택하세요.");
      return;
    }
    if (!window.confirm(`${selectedIds.length}개 이미지를 삭제하시겠습니까?`))
      return;
    try {
      await axios.delete("/api/gallery/manage/bulk", { data: selectedIds });
      alert("선택된 이미지가 삭제되었습니다.");
      fetchImages();
    } catch (err) {
      console.error("선택 삭제 실패:", err);
      alert("선택 삭제 중 오류 발생");
    }
  };

  // ✅ 미리보기
  const handleThumbnailClick = (url) => {
    setSelectedImage(url);
    setIsPreviewOpen(true);
  };

  // ✅ 수정 버튼 클릭
  const handleEdit = async (img) => {
    try {
      const res = await axios.get(`/api/gallery/manage/${img.id}`);
      const data = res.data;

      setEditData({
        id: data.id,
        menuId: data.menuId || "",
        tabGroupId: data.tabGroupId || "",
        description: data.description || "",
        isDetailContent: data.detailContent || data.isDetailContent || false,
        file: null,
      });

      const menuRes = await axios.get("/api/menu/list");
      setMenus(menuRes.data || []);

      if (data.menuId) {
        const tabRes = await axios.get(`/api/tabgroup?subMenuId=${data.menuId}`);
        setTabGroups(tabRes.data || []);
      } else {
        setTabGroups([]);
      }

      setIsEditOpen(true);
    } catch (err) {
      console.error("수정 데이터 불러오기 실패:", err);
      alert("수정 데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  // ✅ 모달 닫기
  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedImage(null);
  };
  const closeEdit = () => {
    setIsEditOpen(false);
    setEditData(null);
  };

  // ✅ 수정 저장
  const handleUpdate = async () => {
    if (!editData.menuId) {
      alert("메뉴를 선택하세요.");
      return;
    }
    const formData = new FormData();
    formData.append("menuId", editData.menuId);
    if (editData.tabGroupId) formData.append("tabGroupId", editData.tabGroupId);
    formData.append("description", editData.description);
    formData.append("isDetailContent", editData.isDetailContent);
    if (editData.file) formData.append("file", editData.file);

    try {
      await axios.put(`/api/gallery/manage/${editData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ 수정이 완료되었습니다.");
      closeEdit();
      fetchImages();
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류 발생");
    }
  };

  // ✅ 페이징 계산 함수
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisible = 5; // 한 번에 보여줄 페이지 버튼 개수
    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(0, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`page-btn ${i === page ? "active" : ""}`}
          onClick={() => setPage(i)}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="gallery-pagination">
        <button
          className="page-btn"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          이전
        </button>
        {pageNumbers}
        <button
          className="page-btn"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages - 1}
        >
          다음
        </button>
      </div>
    );
  };

  return (
    <div className="gallery-page">
      <div className="gallery-table-wrapper">
        {/* 상단 검색 */}
        <div className="gallery-table-header">
          <h2>
            📋 갤러리 관리 · 수정 · 삭제{" "}
            <small>(순번 · 순서 · 썸네일 · 카테고리)</small>
          </h2>
          <div className="gallery-table-actions">
            <div className="gallery-search-box">
              <select
                value={searchField}
                onChange={(e) => {
                  setSearchField(e.target.value);
                  setSearch("");
                  setPage(0);
                }}
              >
                <option value="menuMainName">대그룹</option>
                <option value="menuSubName">중메뉴</option>
                <option value="tabGroupName">탭 그룹</option>
                <option value="sortOrder">순서</option>
              </select>
              <input
                type="text"
                placeholder="검색어 입력..."
                value={search}
                onClick={() => setSearch("")}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="gallery-btn-primary" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </div>

        {/* 테이블 */}
        <table className="gallery-admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>순번</th>
              <th>순서</th>
              <th>썸네일</th>
              <th>대그룹</th>
              <th>중메뉴</th>
              <th>탭 그룹</th>
              <th>등록일</th>
              <th>정렬</th>
              <th>이동</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img, index) => (
              <tr key={img.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(img.id)}
                    onChange={() => handleCheckboxChange(img.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{img.sortOrder}</td>
                <td>
                  <img
                    className="gallery-thumb-img"
                    src={img.imgUrl}
                    alt="썸네일"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleThumbnailClick(img.imgUrl)}
                  />
                </td>
                <td>{img.menuMainName}</td>
                <td>{img.menuSubName}</td>
                <td>{img.tabGroupName}</td>
                <td>{img.regTime?.substring(0, 10)}</td>
                <td>
                  <div className="gallery-btn-group">
                    <button
                      className="gallery-btn-sort"
                      onClick={() => moveUp(index)}
                    >
                      🔼
                    </button>
                    <button
                      className="gallery-btn-sort"
                      onClick={() => moveDown(index)}
                    >
                      🔽
                    </button>
                  </div>
                </td>
                <td>
                  <div className="gallery-btn-group">
                    <button
                      className="gallery-btn-move"
                      onClick={handleSaveOrder}
                    >
                      이동
                    </button>
                  </div>
                </td>
                <td>
                  <div className="gallery-btn-group">
                    <button
                      className="gallery-btn-primary"
                      onClick={() => handleEdit(img)}
                    >
                      수정
                    </button>
                    <button
                      className="gallery-btn-danger"
                      onClick={() => handleDelete(img.id)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ 선택 삭제 */}
        <div className="gallery-bulk-actions">
          <button className="gallery-btn-danger" onClick={handleBulkDelete}>
            선택 삭제
          </button>
        </div>

        {/* ✅ 페이징 */}
        {renderPagination()}
      </div>

      {/* ✅ 미리보기 모달 */}
      {isPreviewOpen && selectedImage && (
        <div className="modal-overlay" onClick={closePreview}>
          <div
            className="modal-content preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closePreview}>
              ✖
            </button>
            <img src={selectedImage} alt="큰 이미지" className="modal-image" />
          </div>
        </div>
      )}

      {/* ✅ 수정 모달 */}
      {isEditOpen && editData && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div
            className="modal-content edit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeEdit}>
              ✖
            </button>
            <h3>이미지 수정</h3>
            <p className="guide-text">
              권장 사이즈: <strong>1024(w) x 128(h)</strong> <br />
              파일 형식: png, jpg, gif / 최대 40MB
            </p>

            <div className="form-row">
              <label>이미지를 연결할 메뉴</label>
              <select
                value={editData.menuId}
                onChange={async (e) => {
                  const menuId = e.target.value;
                  setEditData({ ...editData, menuId, tabGroupId: "" });
                  if (menuId) {
                    try {
                      const res = await axios.get(
                        `/api/tabgroup?subMenuId=${menuId}`
                      );
                      setTabGroups(res.data || []);
                    } catch (err) {
                      console.error("탭 그룹 불러오기 실패:", err);
                    }
                  } else {
                    setTabGroups([]);
                  }
                }}
              >
                <option value="">-- 메뉴 선택 --</option>
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.nameKo} ({menu.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>탭 그룹</label>
              <select
                value={editData.tabGroupId}
                onChange={(e) =>
                  setEditData({ ...editData, tabGroupId: e.target.value })
                }
              >
                <option value="">-- 탭 그룹 선택 --</option>
                {tabGroups.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>이미지 설명</label>
              <textarea
                placeholder="이미지에 대한 설명을 입력하세요..."
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>이미지 파일 업로드</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/gif"
                onChange={(e) =>
                  setEditData({ ...editData, file: e.target.files[0] })
                }
              />
            </div>

            <div className="form-actions">
              <button className="gallery-btn-primary" onClick={handleUpdate}>
                저장
              </button>
              <button className="gallery-btn-secondary" onClick={closeEdit}>
                취소
              </button>
            </div>

            <div className="option-card">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={editData.isDetailContent}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      isDetailContent: e.target.checked,
                    })
                  }
                />
                <span className="slider" />
              </label>
              <div className="switch-text">
                <strong>상세 콘텐츠 전용</strong>
                <small>메인 화면에 썸네일로 노출</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryManage;
