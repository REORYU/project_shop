import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/productNew.css";

function ProductNew() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("판매중");

  const [mainImages, setMainImages] = useState([]); // 대표 이미지
  const [detailImages, setDetailImages] = useState([]); // 상세 이미지

  const [tabs, setTabs] = useState([]); // 메인탭 목록
  const [mainTabId, setMainTabId] = useState(""); // 선택된 메인탭 ID

  // ✅ 메인탭 목록 불러오기
  useEffect(() => {
    axios
      .get("/api/maintab", { params: { sort: "sortOrder" } })
      .then((res) => {
        const content = res.data?.content || [];
        setTabs(content);
      })
      .catch((err) => {
        console.error("메인탭 불러오기 실패:", err);
      });
  }, []);

  // 대표 이미지 업로드 (최대 5장)
  const handleMainImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("대표 이미지는 최대 5장까지 업로드 가능합니다.");
      return;
    }
    setMainImages(files);
  };

  // 상세 이미지 업로드 (최대 10장)
  const handleDetailImages = (e) => {
    const files = Array.from(e.target.files);
    if (detailImages.length + files.length > 10) {
      alert("상세 이미지는 최대 10장까지 업로드 가능합니다.");
      return;
    }
    setDetailImages([...detailImages, ...files]);
  };

  // ✅ 실제 등록 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainTabId) {
      alert("메인탭을 선택하세요!");
      return;
    }

    try {
      const formData = new FormData();

      // 상품 기본정보 JSON
      const productData = {
        title: productName,
        price: Number(price),
        stock: Number(stock),
        description,
        status,
        sortOrder: 0,
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(productData)], { type: "application/json" })
      );

      // 메인탭 ID
      formData.append("mainTabId", mainTabId);

      // 대표 이미지들
      mainImages.forEach((file) => {
        formData.append("mainImages", file);
      });

      // 상세 이미지들
      detailImages.forEach((file) => {
        formData.append("detailImages", file);
      });

      const res = await axios.post("/api/mainproduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("상품이 성공적으로 등록되었습니다!");
      console.log("등록 결과:", res.data);

      // 입력값 초기화
      setProductName("");
      setPrice("");
      setStock(0);
      setDescription("");
      setStatus("판매중");
      setMainImages([]);
      setDetailImages([]);
      setMainTabId("");

    } catch (err) {
      console.error("상품 등록 실패:", err);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="page-container">
      <div className="form-box wide">
        <h2>메인 상품 등록</h2>

        <form onSubmit={handleSubmit}>
          {/* 메인탭 선택 */}
          <label>메인탭</label>
          <select
            value={mainTabId}
            onChange={(e) => setMainTabId(e.target.value)}
            required
          >
            <option value="">메인탭을 선택하세요</option>
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>

          {/* 상품명 */}
          <label>상품명</label>
          <input
            type="text"
            placeholder="상품명을 입력하세요"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />

          {/* 가격 */}
          <label>가격</label>
          <input
            type="number"
            placeholder="가격을 입력하세요"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          {/* 재고 수량 */}
          <label>재고 수량</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />

          {/* 상세 설명 */}
          <label>상세 설명</label>
          <textarea
            placeholder="상품 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          {/* 판매 상태 */}
          <label>판매 상태</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="판매중">판매중</option>
            <option value="품절">품절</option>
            <option value="판매중지">판매중지</option>
          </select>

          {/* 대표 이미지 */}
          <label>대표 이미지 (최대 5장)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMainImages}
          />
          <p className="guide-text">
            하나의 파일 선택 창에서 여러 장을 선택하세요 (최대 5장)
          </p>

          {/* 상세 이미지 */}
          <label>상세 이미지</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleDetailImages}
          />
          <p className="guide-text">최대 10장까지 추가할 수 있습니다</p>

          {/* 등록 버튼 */}
          <button type="submit" className="btn-gold">
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductNew;
