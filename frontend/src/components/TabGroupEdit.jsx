// src/components/TabGroupEdit.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TabGroupNew.css"; // 등록과 동일 CSS 재사용

const API_BASE = "http://localhost:8080";

function TabGroupEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [menuError, setMenuError] = useState("");

  const [message, setMessage] = useState("");   // ✅ 성공 메시지
  const [errorMsg, setErrorMsg] = useState(""); // ✅ 오류 메시지

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sortOrder: 0,
    visible: "노출",
    categoryMain: "",
    categorySub: "",
  });

  // ✅ 메뉴 불러오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingMenus(true);
      try {
        const res = await axios.get(`${API_BASE}/api/menu/list`);
        if (mounted) setMenus(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (mounted) setMenuError("메뉴 목록을 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoadingMenus(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const topMenus = useMemo(() => menus.filter((m) => m.depth === 1), [menus]);
  const midMenus = useMemo(
    () =>
      menus.filter(
        (m) => m.depth === 2 && String(m.parentId) === String(formData.categoryMain)
      ),
    [menus, formData.categoryMain, menus]
  );

  // ✅ 기존 데이터 불러오기
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/tabgroup/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          name: data.name || "",
          description: data.description || "",
          sortOrder: data.sortOrder || 0,
          visible: data.visible ? "노출" : "숨김",
          categoryMain: data.menuId || "",
          categorySub: data.subMenuId || "",
        });
      })
      .catch((err) => console.error("탭 그룹 불러오기 실패:", err));
  }, [id]);

  // ✅ 입력 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryMain") {
      setFormData((prev) => ({ ...prev, categoryMain: value, categorySub: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ 수정 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    try {
      await axios.put(`${API_BASE}/api/tabgroup/${id}`, {
        ...formData,
        visible: formData.visible === "노출",
        menuId: formData.categoryMain,
        subMenuId: formData.categorySub,
      });
      setMessage("✅ 탭 그룹이 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error("수정 실패:", err);
      setErrorMsg("❌ 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="form-card">
      <h2>탭 그룹 수정</h2>

      {/* ✅ 안내 메시지 */}
      {message && <div className="notice success">{message}</div>}
      {errorMsg && <div className="notice error">{errorMsg}</div>}
      {loadingMenus && <div className="notice info">메뉴 불러오는 중…</div>}
      {menuError && <div className="notice error">{menuError}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>탭 이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>설명</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>정렬 순서</label>
          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
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
  );
}

export default TabGroupEdit;
