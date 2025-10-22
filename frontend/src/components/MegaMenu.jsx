import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/megaMenu.css";

function MegaMenu({ onMenuSelect }) {
  const [menus, setMenus] = useState([]);

  // ✅ 트리 구조 메뉴 불러오기
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/menu/tree");
        setMenus(res.data);
      } catch (err) {
        console.error("메뉴 불러오기 실패:", err);
      }
    };
    fetchMenus();
  }, []);

  // ✅ 5개씩 나누기
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const groupedMenus = chunkArray(menus, 5);

  // ✅ 하위 메뉴 클릭 시 → MainPage로 메뉴 정보 전달
  const handleSubMenuClick = (sub) => {
    if (onMenuSelect) {
      onMenuSelect({ id: sub.id, name: sub.name });
    }
  };

  return (
    <div className="mega-menu-wrapper">
      {groupedMenus.map((row, rowIndex) => (
        <div key={rowIndex} className="mega-menu">
          {row.map((group) => (
            <div key={group.id} className="menu-column">
              <h3 className="menu-title">{group.name}</h3>
              <ul className="submenu-list">
                {group.children && group.children.length > 0 ? (
                  group.children.map((sub) => (
                    <li key={sub.id}>
                      <button
                        type="button"
                        className="submenu-link"
                        onClick={() => handleSubMenuClick(sub)}
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="empty">하위 메뉴 없음</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MegaMenu;
