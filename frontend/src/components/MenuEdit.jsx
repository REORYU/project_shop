import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/MenuNew.css"; // 등록폼과 동일 CSS 재사용

function MenuEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ 메뉴 불러오기
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/menu/${id}`)
      .then((res) => setForm(res.data))
      .catch(() => setMessage("❌ 메뉴를 불러올 수 없습니다."));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ 수정 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("PUT 요청 데이터:", form); // 🔍 디버깅용
      await axios.put(`http://localhost:8080/api/menu/${id}`, form, {
        headers: { "Content-Type": "application/json" }, // ✅ 명시
      });
      alert("✅ 수정 완료");
      navigate("/menu/list");
    } catch (err) {
      console.error("PUT 요청 실패:", err); // 🔍 에러 로그
      alert("❌ 수정 실패");
    }
  };

  if (!form) return <p>로딩 중...</p>;

  return (
    <div className="page-container">
      <div className="menu-card">
        <h2>✏️ 메뉴 수정</h2>

        {message && <p className="menu-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label>메뉴 이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <label>단계</label>
            <input
              type="number"
              name="level"
              value={form.level}
              onChange={handleChange}
              min="1"
              max="3"
            />
          </div>

          <div className="input-wrapper">
            <label>상위 메뉴 ID</label>
            <input
              type="number"
              name="parentId"
              value={form.parentId || ""}
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <label>정렬 순서</label>
            <input
              type="number"
              name="sortOrder"
              value={form.sortOrder}
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <label>URL</label>
            <input
              type="text"
              name="url"
              value={form.url || ""}
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <label>사용 여부</label>
            <select
              name="useYn"
              value={form.useYn}
              onChange={handleChange}
            >
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
          </div>

          <button type="submit" className="btn-gold">
            저장
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/menu/list")}
          >
            취소
          </button>
        </form>
      </div>
    </div>
  );
}

export default MenuEdit;
