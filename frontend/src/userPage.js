import { useEffect, useState } from "react";

function UserPage({ user }) {
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // ✅ 유저 정보 가져오기
    fetch("http://localhost:5000/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("프로필 가져오기 오류:", error));

    // ✅ 본인이 작성한 게시글 가져오기
    fetch("http://localhost:5000/user-posts", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setUserPosts(data))
      .catch((error) => console.error("게시글 가져오기 오류:", error));
  }, []);

  if (!profile) {
    return <h2>프로필 정보를 불러오는 중...</h2>;
  }

  return (
    <div>
      <h1>내 프로필</h1>
      <p>아이디: {profile.username}</p>

      <h2>내가 작성한 글</h2>
      <ul>
        {userPosts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.created_at}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPage;
