import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MenuNew.css"; // 등록폼 전용 CSS

function MenuNew() {
  const [form, setForm] = useState({
    name: "",
    depth: 1,        // ✅ level → depth
    parentId: "",
    orderNum: 0,     // ✅ sortOrder → orderNum
    url: "",
    useYn: "Y",      // ✅ 바로 Y/N으로 저장
  });

  const [menus, setMenus] = useState([]);   // ✅ DB에서 불러온 메뉴
  const [message, setMessage] = useState(""); // ✅ 안내 메시지
  const [focusedField, setFocusedField] = useState("");

  // ✅ 메뉴 목록 불러오기
  useEffect(() => {
    axios.get("http://localhost:8080/api/menu/list")
      .then((res) => setMenus(res.data))
      .catch((err) => console.error("메뉴 불러오기 실패:", err));
  }, []);

  // ✅ 대분류 + 중분류 묶기
  const groupedMenus = menus
    .filter(menu => menu.depth === 1)   // ✅ depth 기준
    .map(group => ({
      ...group,
      children: menus.filter(
        (m) => m.depth === 2 && m.parentId === group.id
      ),
    }));

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/menu", {
        name: form.name,
        depth: Number(form.depth),                // ✅ depth
        parentId: form.parentId ? Number(form.parentId) : null,
        orderNum: Number(form.orderNum),          // ✅ orderNum
        url: form.url,
        useYn: form.useYn                         // ✅ Y/N 그대로
      });

      // ✅ 메시지로 안내
      setMessage("✅ 메뉴가 성공적으로 등록되었습니다.");

      // 입력값 초기화
      setForm({
        name: "",
        depth: 1,
        parentId: "",
        orderNum: 0,
        url: "",
        useYn: "Y",
      });
    } catch (err) {
      console.error("등록 실패:", err);
      setMessage("❌ 등록 실패. 다시 시도해주세요.");
    }
  };

  return (
    <div className="page-container">
      <div className="menu-card">
        <h2>📂 메뉴 등록</h2>

        {/* ✅ 안내 메시지 출력 (성공/실패 구분) */}
        {message && (
          <p className={`form-message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* 메뉴 이름 */}
          <div className="input-wrapper">
            <label>메뉴 이름</label>
            <input
              type="text"
              name="name"
              placeholder="예: 행사무대 / 합창무대"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField("")}
              required
            />
            {focusedField === "name" && <span className="focus-icon">✏️</span>}
          </div>

          {/* 메뉴 단계 */}
          <div className="input-wrapper">
            <label>메뉴 단계 (1=대분류, 2=중분류, 3=소분류)</label>
            <input
              type="number"
              name="depth"
              min="1"
              max="3"
              value={form.depth}
              onChange={handleChange}
              onFocus={() => setFocusedField("depth")}
              onBlur={() => setFocusedField("")}
              required
            />
            {focusedField === "depth" && <span className="focus-icon">🔢</span>}
          </div>

          {/* 상위 메뉴 */}
          <div className="input-wrapper">
            <label>상위 메뉴 (대분류/중분류 선택)</label>
            <select
              name="parentId"
              value={form.parentId}
              onChange={handleChange}
              onFocus={() => setFocusedField("parentId")}
              onBlur={() => setFocusedField("")}
            >
              <option value="">-- 없음 (대분류용) --</option>
              {groupedMenus.map((group) => (
                <React.Fragment key={group.id}>
                  <option value={group.id}>{group.name}</option>
                  {group.children.map((child) => (
                    <option key={child.id} value={child.id}>
                      &nbsp;&nbsp;↳ {child.name}
                    </option>
                  ))}
                </React.Fragment>
              ))}
            </select>
            {focusedField === "parentId" && <span className="focus-icon">📂</span>}
          </div>

          {/* 정렬 순서 */}
          <div className="input-wrapper">
            <label>정렬 순서</label>
            <input
              type="number"
              name="orderNum"
              min="0"
              value={form.orderNum}
              onChange={handleChange}
              onFocus={() => setFocusedField("orderNum")}
              onBlur={() => setFocusedField("")}
            />
            {focusedField === "orderNum" && <span className="focus-icon">🔀</span>}
          </div>

          {/* URL */}
          <div className="input-wrapper">
            <label>URL (선택)</label>
            <input
              type="text"
              name="url"
              placeholder="예: /product/list"
              value={form.url}
              onChange={handleChange}
              onFocus={() => setFocusedField("url")}
              onBlur={() => setFocusedField("")}
            />
            {focusedField === "url" && <span className="focus-icon">🌐</span>}
          </div>

          {/* 사용 여부 */}
          <div className="input-wrapper">
            <label>사용 여부</label>
            <select
              name="useYn"
              value={form.useYn}
              onChange={handleChange}
              onFocus={() => setFocusedField("useYn")}
              onBlur={() => setFocusedField("")}
            >
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
            {focusedField === "useYn" && <span className="focus-icon">✅</span>}
          </div>

          <button type="submit" className="btn-gold">등록하기</button>
        </form>
      </div>
    </div>
  );
}

export default MenuNew;
