// src/components/ImageUploadForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/ImageUpload.css";

function ImageUploadForm({ productId, onSuccess, onCancel }) {
  const [files, setFiles] = useState([]); // ✅ 여러 파일
  const [repImgYn, setRepImgYn] = useState("N"); // ✅ 대표 여부 선택

  // ✅ 업로드 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      alert("최소 1개의 이미지를 업로드해주세요.");
      return;
    }
    if (files.length > 5) {
      alert("최대 5개의 파일까지만 업로드 가능합니다.");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("repImgYn", repImgYn);

      await axios.post(`/api/mainproduct/${productId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ 이미지가 성공적으로 등록되었습니다.");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("❌ 업로드 실패:", err);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ✅ 대표 이미지 여부 */}
      <div className="form-row">
        <label>대표 이미지 여부</label>
        <select value={repImgYn} onChange={(e) => setRepImgYn(e.target.value)}>
          <option value="Y">대표 이미지</option>
          <option value="N">상세 이미지</option>
        </select>
      </div>

      {/* ✅ 파일 업로드 */}
      <div className="form-row">
        <label>이미지 파일 업로드 (최대 5개)</label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/gif"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
      </div>

      {/* ✅ 버튼 */}
      <div className="mpd-modal-actions">
        <button type="submit" className="btn-gold">
          저장
        </button>
        <button type="button" className="btn-outline" onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  );
}

export default ImageUploadForm;
