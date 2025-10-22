// src/components/GalleryDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // ✅ 애니메이션 추가
import "../styles/GalleryDetail.css";

function GalleryDetail({
  currentUser,
  menuId: propMenuId,
  menuName: propMenuName,
}) {
  const { menuId: paramMenuId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ menuId 최종 해석 (param → query → state → prop)
  const resolvedMenuId = useMemo(() => {
    return (
      paramMenuId ||
      searchParams.get("menuId") ||
      location.state?.menuId ||
      propMenuId ||
      ""
    );
  }, [paramMenuId, searchParams, location.state, propMenuId]);

  // ✅ menuName 해석
  const resolvedMenuName = useMemo(() => {
    return location.state?.menuName || propMenuName || "";
  }, [location.state, propMenuName]);

  const [tabGroups, setTabGroups] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [images, setImages] = useState([]);

  // ✅ 백엔드 기본 주소
  const API_BASE_URL = "http://127.0.0.1:8080";

  // ✅ 유저 정보 (props → localStorage fallback)
  const user = useMemo(() => {
    if (currentUser) return currentUser;
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, [currentUser]);

  // ✅ 권한 체크
  const isOwner = (user?.email || "").toLowerCase() === "yousung70@nate.com";
  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "ROLE_ADMIN" ||
    (Array.isArray(user?.authorities) &&
      user.authorities.some((a) => a.authority === "ROLE_ADMIN"));

  const showAddButton = isOwner || isAdmin;

  // ✅ 탭 그룹 불러오기
  useEffect(() => {
    if (!resolvedMenuId) return;
    axios
      .get(`/api/tabgroup?subMenuId=${resolvedMenuId}`)
      .then((res) => {
        const list = res.data || [];
        setTabGroups(list);
        if (list.length > 0) setActiveTab(list[0].id);
      })
      .catch((err) => console.error("❌ 탭 그룹 불러오기 실패:", err));
  }, [resolvedMenuId]);

  // ✅ 이미지 불러오기
  useEffect(() => {
    if (!resolvedMenuId || !activeTab) return;
    axios
      .get(`/api/gallery?menuId=${resolvedMenuId}&tabGroupId=${activeTab}`)
      .then((res) => setImages(res.data || []))
      .catch((err) => {
        console.error("❌ 이미지 불러오기 실패:", err);
        setImages([]);
      });
  }, [resolvedMenuId, activeTab]);

  return (
    <div className="gallery-detail">
      <h2 className="gallery-title">[{resolvedMenuName}]</h2>

      {/* ✅ 탭 그룹 버튼 */}
      <div className="tab-buttons">
        {tabGroups.length > 0 ? (
          tabGroups.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))
        ) : (
          <p className="no-content">등록된 탭 그룹이 없습니다.</p>
        )}
      </div>

      {/* ✅ 이미지 목록 */}
      <div className="gallery-images">
        {images.length > 0 ? (
          [...images]
            // ✅ sortOrder 오름차순 정렬 → 새로 추가된 이미지가 항상 맨 뒤로 감
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((img, index) =>
              img.description ? (
                <motion.div
                  key={img.id}
                  className="content-row"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="content-image">
                    <img
                      src={`${API_BASE_URL}${img.imgUrl}`}
                      alt={img.title || "gallery image"}
                    />
                  </div>
                  <motion.div
                    className="content-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    dangerouslySetInnerHTML={{ __html: img.description }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={img.id}
                  className="content-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <img
                    src={`${API_BASE_URL}${img.imgUrl}`}
                    alt={img.title || "gallery image"}
                  />
                </motion.div>
              )
            )
        ) : (
          <p className="no-content">이미지가 없습니다.</p>
        )}
      </div>

      {/* ✅ 이미지 추가 버튼 */}
      {showAddButton && (
        <div className="add-image-btn-wrapper">
          <button
            className="add-image-btn"
            onClick={() =>
              navigate(
                `/gallery/upload?menuId=${resolvedMenuId}&tabGroupId=${activeTab}`
              )
            }
          >
            + 이미지 추가하기
          </button>
        </div>
      )}
    </div>
  );
}

export default GalleryDetail;
