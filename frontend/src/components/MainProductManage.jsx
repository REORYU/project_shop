// src/components/MainProductManage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/mainProductManage.css";

function MainProductManage() {
  const [products, setProducts] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [searchField, setSearchField] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImg, setPreviewImg] = useState("");

  // ✅ 메인탭 불러오기
  useEffect(() => {
    axios
      .get("/api/maintab", { params: { sort: "sortOrder" } })
      .then((res) => {
        setTabs(res.data?.content || []);
      })
      .catch((err) => {
        console.error("메인탭 불러오기 실패:", err);
        setTabs([]);
      });
  }, []);

  // ✅ 상품 불러오기
  useEffect(() => {
    if (tabs.length === 0) return;
    axios
      .get("/api/mainproduct/list", {
        params: {
          mainTabId: tabs[0].id,
          page: currentPage - 1,
          size: rowsPerPage,
        },
      })
      .then((res) => {
        setProducts(res.data?.content || []);
      })
      .catch((err) => {
        console.error("상품 불러오기 실패:", err);
        setProducts([]);
      });
  }, [tabs, currentPage]);

  // ✅ 검색 필터링
  const filteredProducts = products.filter((p) => {
    if (searchField === "title")
      return p.title?.toLowerCase().includes(searchTerm.toLowerCase());
    if (searchField === "tab")
      return p.mainTabName?.toLowerCase().includes(searchTerm.toLowerCase());
    if (searchField === "date")
      return p.regTime?.toLowerCase().includes(searchTerm.toLowerCase());
    return true;
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  // ✅ 체크박스 선택
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ 선택 삭제
  const deleteSelected = async () => {
    if (selected.length === 0) return;
    try {
      await axios.delete("/api/mainproduct/bulk", { data: { ids: selected } });
      setProducts((prev) => prev.filter((p) => !selected.includes(p.id)));
      setSelected([]);
      alert("선택한 상품이 삭제되었습니다.");
    } catch (err) {
      console.error("선택 삭제 실패:", err);
      alert("선택 삭제 중 오류 발생");
    }
  };

  // ✅ 단일 삭제
  const deleteOne = async (id) => {
    try {
      await axios.delete("/api/mainproduct/bulk", { data: { ids: [id] } });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("상품이 삭제되었습니다.");
    } catch (err) {
      console.error("상품 삭제 실패:", err);
      alert("상품 삭제 중 오류 발생");
    }
  };

  // ✅ 정렬
  const moveUp = (index) => {
    if (index === 0) return;
    const newProducts = [...products];
    [newProducts[index - 1], newProducts[index]] = [
      newProducts[index],
      newProducts[index - 1],
    ];
    setProducts(newProducts);
  };

  const moveDown = (index) => {
    if (index === products.length - 1) return;
    const newProducts = [...products];
    [newProducts[index + 1], newProducts[index]] = [
      newProducts[index],
      newProducts[index + 1],
    ];
    setProducts(newProducts);
  };

  // ✅ 정렬 저장
  const saveSortOrder = async () => {
    try {
      const updated = products.map((p, i) => ({
        id: p.id,
        sortOrder: i,
      }));
      await axios.put("/api/mainproduct/sort", updated);
      alert("정렬 순서가 저장되었습니다.");
    } catch (err) {
      console.error("정렬 저장 실패:", err);
      alert("정렬 저장 중 오류 발생");
    }
  };

  // ✅ 수정 저장
  const saveEdit = async () => {
    try {
      await axios.put(`/api/mainproduct/${editData.id}`, editData);
      setProducts((prev) =>
        prev.map((p) => (p.id === editData.id ? editData : p))
      );
      setIsEditOpen(false);
      alert("상품이 수정되었습니다.");
    } catch (err) {
      console.error("상품 수정 실패:", err);
      alert("상품 수정 중 오류 발생");
    }
  };

  return (
    <div className="mt-page">
      <div className="mt-container">
        {/* 제목 + 검색 */}
        <div className="mt-header">
          <h2>📋 메인상품관리</h2>
          <div className="mt-search-box">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="title">상품명</option>
              <option value="tab">탭 이름</option>
              <option value="date">등록일</option>
            </select>
            <input
              type="text"
              placeholder="검색어 입력..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setCurrentPage(1)}>검색</button>
          </div>
        </div>

        {/* 테이블 */}
        <table className="mt-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    currentRows.length > 0 &&
                    selected.length === currentRows.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected([...new Set([...currentRows.map((p) => p.id)])]);
                    } else {
                      setSelected([]);
                    }
                  }}
                />
              </th>
              <th>순번</th>
              <th>순서</th>
              <th>썸네일</th>
              <th>탭 이름</th>
              <th>상품명</th>
              <th>등록일</th>
              <th>정렬</th>
              <th>이동</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((product, index) => (
              <tr key={product.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleSelect(product.id)}
                  />
                </td>
                <td>{indexOfFirst + index + 1}</td>
                <td>{product.sortOrder}</td>
                <td>
                  <img
                    src={
                      product.imagePaths && product.imagePaths.length > 0
                        ? product.imagePaths[0]
                        : "/images/no-img.png"
                    }
                    alt={product.title}
                    className="thumb-img"
                    onClick={() => {
                      setPreviewImg(
                        product.imagePaths && product.imagePaths.length > 0
                          ? product.imagePaths[0]
                          : "/images/no-img.png"
                      );
                      setIsPreviewOpen(true);
                    }}
                  />
                </td>
                <td>{product.mainTabName}</td>
                <td>{product.title}</td>
                <td>{product.regTime?.substring(0, 10)}</td>
                <td>
                  <button
                    className="btn-sort"
                    onClick={() => moveUp(indexOfFirst + index)}
                  >
                    🔼
                  </button>
                  <button
                    className="btn-sort"
                    onClick={() => moveDown(indexOfFirst + index)}
                  >
                    🔽
                  </button>
                </td>
                <td>
                  <button className="btn btn-move">이동</button>
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setEditData(product);
                        setIsEditOpen(true);
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => deleteOne(product.id)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bulk-actions">
          <button className="btn btn-outline-danger" onClick={deleteSelected}>
            선택 삭제
          </button>
          <button className="btn btn-outline-primary" onClick={saveSortOrder}>
            정렬 저장
          </button>
        </div>

        {/* 페이징 */}
        <div className="mt-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
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
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            다음 ▶
          </button>
        </div>
      </div>

      {/* 수정 모달 */}
      {isEditOpen && (
        <div className="modal-overlay">
          <div className="modal-content wide">
            <h3>상품 수정</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEdit();
              }}
            >
              <label>메인탭</label>
              <select
                value={editData?.mainTabName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, mainTabName: e.target.value })
                }
              >
                <option value="">메인탭을 선택하세요</option>
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.name}>
                    {tab.name}
                  </option>
                ))}
              </select>

              <label>상품명</label>
              <input
                type="text"
                value={editData?.title || ""}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />

              <label>가격</label>
              <input
                type="number"
                value={editData?.price || ""}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
              />

              <label>재고 수량</label>
              <input
                type="number"
                value={editData?.stock || 0}
                onChange={(e) =>
                  setEditData({ ...editData, stock: e.target.value })
                }
              />

              <label>상세 설명</label>
              <textarea
                value={editData?.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              ></textarea>

              <label>판매 상태</label>
              <select
                value={editData?.status || "판매중"}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
              >
                <option value="판매중">판매중</option>
                <option value="품절">품절</option>
                <option value="판매중지">판매중지</option>
              </select>

              <div className="modal-actions">
                <button type="submit" className="btn-gold">
                  저장
                </button>
                <button
                  type="button"
                  className="btn-gray"
                  onClick={() => setIsEditOpen(false)}
                >
                  닫기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 이미지 미리보기 모달 */}
      {isPreviewOpen && (
        <div className="modal-overlay" onClick={() => setIsPreviewOpen(false)}>
          <div className="modal-content preview">
            <img src={previewImg} alt="미리보기" className="preview-img" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainProductManage;
