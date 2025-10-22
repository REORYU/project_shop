// src/components/ImageUpload.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ImageUpload.css";

function ImageUpload() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const defaultMenuId = searchParams.get("menuId") || "";
  const defaultTabGroupId = searchParams.get("tabGroupId") || "";

  const [menus, setMenus] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(defaultMenuId);
  const [tabGroups, setTabGroups] = useState([]);
  const [selectedTabGroup, setSelectedTabGroup] = useState(defaultTabGroupId);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isDetailContent, setIsDetailContent] = useState(false);

  // ✅ 전체 메뉴 불러오기
  useEffect(() => {
    axios
      .get("/api/menu/list")
      .then((res) => setMenus(res.data || []))
      .catch((err) => console.error("❌ 메뉴 불러오기 실패:", err));
  }, []);

  // ✅ 선택된 메뉴 → 탭 그룹 불러오기
  useEffect(() => {
    if (selectedMenuId) {
      axios
        .get(`/api/tabgroup?subMenuId=${selectedMenuId}`)
        .then((res) => setTabGroups(res.data || []))
        .catch((err) => console.error("❌ 탭 그룹 불러오기 실패:", err));
    } else {
      setTabGroups([]);
      setSelectedTabGroup("");
    }
  }, [selectedMenuId]);

  // ✅ 저장 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMenuId) {
      alert("메뉴를 선택해주세요.");
      return;
    }
    if (!selectedTabGroup) {
      alert("탭 그룹을 선택해주세요.");
      return;
    }
    if (!file) {
      alert("이미지를 업로드해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("menuId", selectedMenuId);
      formData.append("tabGroupId", selectedTabGroup);
      formData.append("description", description);
      formData.append("file", file);
      formData.append("isDetailContent", isDetailContent ? "true" : "false"); // ✅ boolean → string 변환

      await axios.post("/api/gallery/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ 이미지가 성공적으로 등록되었습니다.");

      // 상태 초기화 후 이전 페이지로 이동
      handleReset();
      navigate(-1);
    } catch (err) {
      console.error("❌ 업로드 실패:", err);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  const handleReset = () => {
    setSelectedMenuId("");
    setSelectedTabGroup("");
    setDescription("");
    setFile(null);
    setIsDetailContent(false);
  };

  return (
    <div className="page-container">
      <div className="form-box wide">
        <h2>이미지 등록</h2>
        <p className="guide-text">
          권장 사이즈: <strong>1024(w) x 128(h)</strong> <br />
          파일 형식: png, jpg, gif / 최대 40MB
        </p>

        <form onSubmit={handleSubmit}>
          {/* ✅ 메뉴 선택 */}
          <div className="form-row">
            <label>이미지를 연결할 메뉴</label>
            <select
              value={selectedMenuId}
              onChange={(e) => setSelectedMenuId(e.target.value)}
            >
              <option value="">-- 메뉴 선택 --</option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.nameKo} ({menu.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* ✅ 탭 그룹 선택 */}
          <div className="form-row">
            <label>탭 그룹</label>
            <select
              value={selectedTabGroup}
              onChange={(e) => setSelectedTabGroup(e.target.value)}
            >
              <option value="">-- 탭 그룹 선택 --</option>
              {tabGroups.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ 이미지 설명 */}
          <div className="form-row">
            <label>이미지 설명</label>
            <textarea
              placeholder="이미지에 대한 설명을 입력하세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ✅ 파일 업로드 */}
          <div className="form-row">
            <label>이미지 파일 업로드</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {/* ✅ 버튼 */}
          <div className="form-actions">
            <button type="submit" className="btn-gold">
              저장
            </button>
            <button type="button" className="btn-secondary" onClick={handleReset}>
              초기화
            </button>
          </div>

          {/* ✅ 상세 콘텐츠 전용 */}
          <div className="option-card">
            <label className="switch">
              <input
                type="checkbox"
                checked={isDetailContent}
                onChange={(e) => setIsDetailContent(e.target.checked)}
              />
              <span className="slider" />
            </label>
            <div className="switch-text">
              <strong>상세 콘텐츠 전용</strong>
              <small>메인 화면에 썸네일로 노출</small>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImageUpload;
