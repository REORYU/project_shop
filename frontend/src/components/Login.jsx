import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/theme-gold.css";
import "../App.css";

function Login({ setIsLoggedIn, setRole, setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        // ✅ 서버 응답 데이터 기반으로 userData 구성
        const userData = {
          memberId: res.data.memberId,
          email: res.data.email?.toLowerCase(), // ✅ 이메일 소문자 변환
          name: res.data.name,
          role: res.data.role,
        };

        // ✅ 디버깅용 로그
        console.log("로그인 성공 → 저장될 사용자 정보:", userData);

        // ✅ 상태 업데이트
        setIsLoggedIn(true);
        setRole(userData.role);
        setCurrentUser(userData);

        // ✅ localStorage 저장
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", userData.role);

        // ✅ 메인으로 이동
        navigate("/");
      } else {
        setIsLoggedIn(false);
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("로그인 요청 실패:", err);
      setIsLoggedIn(false);
      setError("로그인 실패: 서버와의 통신 오류");
    }
  };

  return (
    <div className="page-container">
      <div className="form-box wide" style={{ textAlign: "center" }}>
        <h2
          style={{
            marginBottom: "24px",
            color: "var(--color-gold)",
          }}
        >
          로그인
        </h2>
        <form onSubmit={handleLogin}>
          {error && (
            <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>
          )}

          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "24px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            className="btn-gold"
            style={{ width: "100%", padding: "12px", fontSize: "16px" }}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
