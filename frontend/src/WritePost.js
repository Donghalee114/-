import { useState } from "react";
import { useNavigate } from "react-router-dom";

function WritePost({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("게시글이 등록되었습니다!");
        navigate("/");
      })
      .catch((error) => console.error("게시글 작성 오류:", error));
  };

  return (
    <div>
      <h2>글 작성</h2>
      <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSubmit}>작성</button>
    </div>
  );
}

export default WritePost;
