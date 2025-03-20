import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // ✅ 개별 CSS 파일 추가

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("회원가입 실패: " + data.error);
        } else {
          alert("회원가입 성공! 로그인해주세요.");
          navigate("/login");
        }
      })
      .catch((error) => console.error("회원가입 오류:", error));
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>회원가입</h2>
        <p>새 계정을 만들어보세요.</p>
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
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
        />
        <button onClick={handleSignup} className="signup-button">회원가입</button>
        <p className="login-link">이미 계정이 있나요? <a href="/login">로그인</a></p>
      </div>
    </div>
  );
}

export default Signup;
