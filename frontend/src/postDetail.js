import { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import "./PostDetail.css"; // ✅ CSS 파일 추가

function PostDetail(){
    const {id} = useParams();
    const [post , setPost] = useState(null)
    const token = localStorage.getItem("token")

    useEffect(() => {
        fetch(`http://localhost:5000/posts/${id}`)
        .then((res) => res.json())
        .then((data) => setPost(data))
        .catch((error) => console.error("게시글 불러오기 오류" , error))
    }, [id, token]);


    if(!post){
        return <h2>게시글을 불러오는중...</h2>
    }

    return(
        <div>
            <h1>{post.title}</h1>
            <p>작성자: {post.username}</p>
            <p>작성일: {post.created_at}</p>
            <p>{post.content}</p>
            <Link to="/">게시판으로 돌아가기</Link>
        </div>
    );
}

export default PostDetail