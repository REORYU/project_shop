import React, { useEffect, useState } from "react";
import axios from "axios";

function TestApi() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/hello")
      .then(res => setMessage(res.data))
      .catch(err => setMessage("API 호출 실패: " + err.message));
  }, []);

  return (
    <div className="page-container">
      <div className="form-box wide">
        <h2>Spring Boot 연결 테스트</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default TestApi;
