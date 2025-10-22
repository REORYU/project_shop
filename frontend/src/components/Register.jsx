import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/theme-gold.css";
import "../App.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // ✅ 성공 상태

  // ✅ 성공 시 1.2초 후 자동 이동
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate("/login"), 1200);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "USER"
      });

      setError("");
      setSuccess(true); // ✅ 성공 화면으로 전환
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "회원가입 실패. 다시 시도해주세요.";
      setError(errorMsg);
    }
  };

  // ✅ 성공 화면
  if (success) {
    return (
      <div className="page-container">
        <div
          className="form-box"
          style={{
            maxWidth: "450px",
            margin: "60px auto",
            padding: "40px 30px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            textAlign: "center"
          }}
        >
          <h2 style={{ color: "var(--color-gold)", marginBottom: 10 }}>
            회원가입 완료 🎉
          </h2>
          <p>로그인 페이지로 이동 중입니다…</p>
        </div>
      </div>
    );
  }

  // ✅ 기본 폼
  return (
    <div className="page-container">
      <div
        className="form-box"
        style={{
          maxWidth: "450px",
          margin: "60px auto",
          padding: "30px",
          position: "relative",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "var(--color-gold)"
          }}
        >
          회원가입
        </h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "15px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "15px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "15px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>
              비밀번호 확인
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "15px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-gold"
            style={{ width: "100%", padding: "12px", fontSize: "16px" }}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
