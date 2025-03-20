import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Board.css";

function Board({ user, setUser }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("게시글 가져오기 오류:", error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <>
      {/* ✅ 네비게이션 바 */}
      <header className="navbar">
        <h1>📌 게시판</h1>
        <div className="auth-buttons">
          {user ? (
            <>
              <span className="user-info"> {user}님</span>
              <Link to="/write" className="button">글 작성</Link>
              <Link to="/user" className="button">마이페이지</Link>
              <button className="button logout" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="button">로그인</Link>
              <Link to="/signup" className="button">회원가입</Link>
            </>
          )}
        </div>
      </header>

      {/* ✅ 게시판 컨테이너 */}
      <div className="board-container">
        {/* ✅ 배경 이미지 추가 */}

        <div className="post-list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <Link to={`/post/${post.id}`} className="post-title">{post.title}</Link>
                <p className="post-meta">📝 {post.username} | 📅 {post.created_at}</p>
              </div>
            ))
          ) : (
            <p className="no-posts">아직 게시글이 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Board;
