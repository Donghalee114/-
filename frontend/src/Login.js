import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // ✅ 개별 CSS 파일 추가

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
  
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setUser(username);
          navigate("/");
        } else {
          alert("로그인 실패: " + data.error);
          setUsername("");
          setPassword("");
        }
      })
      .catch((error) => console.error("로그인 오류:", error));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>로그인</h2>
        <p>계정을 입력하세요.</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button  className="login-button">로그인</button>
        </form>
        <p className="signup-link">아직 계정이 없나요? <a href="/signup">회원가입</a></p>
      </div>
    </div>
  );
}  

export default Login;
