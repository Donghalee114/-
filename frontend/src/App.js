import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Board from "./Board";
import WritePost from "./WritePost";
import PostDetail from "./postDetail"
import UserPage from "./userPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setUser(data.username); // ✅ 로그인 상태 유지
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Board user={user} setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/write" element={user ? <WritePost user={user} /> : <Navigate to="/login" />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/user" element={user ? <UserPage user={user} /> : <p>로그인이 필요합니다.</p>} />
      </Routes>
    </Router>
  );
}

export default App;
