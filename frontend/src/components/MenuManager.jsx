import React, { useState } from "react";
import "../styles/menuAdmin.css";   // ✅ CSS 연결

function MenuManager() {
  const [menuData, setMenuData] = useState([]);

  // 대분류 추가
  const addGroup = () => {
    const title = prompt("새 대분류 이름 입력:");
    if (title) {
      const newGroup = {
        id: Date.now(),
        title,
        items: []
      };
      setMenuData((prev) => [...prev, newGroup]);
    }
  };

  // 중분류 추가
  const addItem = (groupId) => {
    const item = prompt("새 항목 이름 입력:");
    if (item) {
      setMenuData((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? { ...group, items: [...group.items, item] }
            : group
        )
      );
    }
  };

  // 항목 삭제
  const handleDelete = (groupId, itemIndex) => {
    setMenuData((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, items: group.items.filter((_, i) => i !== itemIndex) }
          : group
      )
    );
  };

  // 항목 수정
  const handleEdit = (groupId, itemIndex, newValue) => {
    setMenuData((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map((item, i) =>
                i === itemIndex ? newValue : item
              )
            }
          : group
      )
    );
  };

  return (
    <div className="menu-wrapper">
      <h2 className="menu-title">메뉴 관리</h2>
      <button onClick={addGroup} className="btn-gold">+ 대분류 추가</button>

      <div className="menu-group">
        {menuData.map((group) => (
          <div key={group.id} className="menu-box">
            <h3 className="menu-subtitle">{group.title}</h3>
            <button onClick={() => addItem(group.id)} className="btn-sub">
              + 항목 추가
            </button>
            <ul className="menu-list">
              {group.items.map((item, index) => (
                <li key={index} className="menu-item">
                  <span>{item}</span>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      const newValue = prompt("새 이름 입력:", item);
                      if (newValue) handleEdit(group.id, index, newValue);
                    }}
                  >
                    ✏ 수정
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(group.id, index)}
                  >
                    🗑 삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuManager;
