// src/components/TabGroupNew.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/TabGroupNew.css";

const API_BASE = "http://localhost:8080";

function TabGroupNew() {
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [menuError, setMenuError] = useState("");
  const [message, setMessage] = useState(""); // ✅ 안내 메시지 상태
  const [errorMsg, setErrorMsg] = useState(""); // ✅ 오류 메시지 상태

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sortOrder: 0,
    visible: "노출",
    categoryMain: "",
    categorySub: "",
  });

  // ===== 메뉴 불러오기 =====
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingMenus(true);
      setMenuError("");
      try {
        const res = await axios.get(`${API_BASE}/api/menu/list`);
        if (!mounted) return;
        setMenus(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("메뉴 불러오기 실패:", e);
        if (mounted) setMenuError("메뉴 목록을 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoadingMenus(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 대분류 / 중분류
  const topMenus = useMemo(() => menus.filter((m) => m.depth === 1), [menus]);
  const midMenus = useMemo(
    () =>
      menus.filter(
        (m) => m.depth === 2 && String(m.parentId) === String(formData.categoryMain)
      ),
    [menus, formData.categoryMain, menus]
  );

  // ===== 입력 처리 =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryMain") {
      setFormData((prev) => ({ ...prev, categoryMain: value, categorySub: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ===== 저장 =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    if (!formData.name.trim()) return setErrorMsg("⚠️ 탭 이름을 입력하세요.");
    if (!formData.categoryMain) return setErrorMsg("⚠️ 대분류를 선택하세요.");
    if (!formData.categorySub) return setErrorMsg("⚠️ 중분류를 선택하세요.");

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      sortOrder: Number(formData.sortOrder) || 0,
      visible: formData.visible === "노출",
      menuCategoryId: Number(formData.categoryMain), // ✅ 대분류
      menuId: Number(formData.categorySub), // ✅ 중분류
      subMenuId: Number(formData.categorySub), // ✅ 동일하게 subMenuId도 전달
    };

    try {
      await axios.post(`${API_BASE}/api/tabgroup`, payload);
      setMessage("✅ 탭 그룹이 성공적으로 등록되었습니다.");
      // 👉 등록 후에도 그대로 폼에 남기고 싶으면 reset 제거
      setFormData({
        name: "",
        description: "",
        sortOrder: 0,
        visible: "노출",
        categoryMain: "",
        categorySub: "",
      });
    } catch (err) {
      console.error("탭 그룹 저장 실패:", err.response || err.message || err);
      setErrorMsg("❌ 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h2>탭 그룹 등록</h2>

        {/* ✅ 안내 메시지 출력 */}
        {message && <div className="notice success">{message}</div>}
        {errorMsg && <div className="notice error">{errorMsg}</div>}

        {loadingMenus && <div className="notice info">메뉴 불러오는 중…</div>}
        {menuError && <div className="notice error">{menuError}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>탭 이름</label>
            <input
              type="text"
              name="name"
              placeholder="탭 이름 입력"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>설명</label>
            <textarea
              name="description"
              placeholder="탭 설명 입력"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>정렬 순서</label>
            <input
              type="number"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              min={0}
            />
          </div>

          <div className="form-group">
            <label>노출 여부</label>
            <select
              name="visible"
              value={formData.visible}
              onChange={handleChange}
            >
              <option value="노출">노출</option>
              <option value="숨김">숨김</option>
            </select>
          </div>

          <div className="form-group">
            <label>대분류</label>
            <select
              name="categoryMain"
              value={formData.categoryMain}
              onChange={handleChange}
              disabled={loadingMenus || topMenus.length === 0}
            >
              <option value="">대분류 선택</option>
              {topMenus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>중분류</label>
            <select
              name="categorySub"
              value={formData.categorySub}
              onChange={handleChange}
              disabled={!formData.categoryMain || midMenus.length === 0}
            >
              <option value="">중분류 선택</option>
              {midMenus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-gold">
              저장
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/tabgroup/list")}
            >
              목록으로
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TabGroupNew;
