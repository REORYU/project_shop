import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/mainTab.css";

function MainTabNew() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("메인탭 이름을 입력하세요.");
      return;
    }

    try {
      await axios.post("/api/maintab", { name, description });
      alert("메인탭이 등록되었습니다.");
      navigate("/main-tab/list"); // ✅ 등록 후 메인탭 관리 화면으로 이동
    } catch (err) {
      console.error("메인탭 등록 실패:", err);
      alert("메인탭 등록에 실패했습니다.");
    }
  };

  const handleReset = () => {
    setName("");
    setDescription("");
  };

  return (
    <div className="main-tab-wrapper">
      <div className="main-tab-header">
        <span role="img" aria-label="icon">🗂</span>
        <h2>메인탭 등록</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>메인탭 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="메인탭 이름을 입력하세요..."
            required
          />
          <small>메인 화면 상단 메뉴에 표시될 이름입니다.</small>
        </div>

        <div className="form-group">
          <label>설명 (선택)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="간단한 설명을 입력하세요..."
          />
          <small>관리자만 참고할 수 있는 메모 용도입니다.</small>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-gold">저장</button>
          <button type="button" className="btn-gray" onClick={handleReset}>초기화</button>
        </div>
      </form>
    </div>
  );
}

export default MainTabNew;
