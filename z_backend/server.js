require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const db = new sqlite3.Database("./site.db");

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

app.use(express.json());
app.use(cors());

/** ✅ JWT 인증 미들웨어 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "로그인이 필요합니다." });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "유효하지 않은 토큰입니다." });

    req.user = decoded; // 🔹 사용자 정보 저장 (req.user.id, req.user.username)
    next();
  });
};

/** ✅ 게시글 목록 가져오기 (username 포함) */
app.get("/posts", (req, res) => {
  const sql = `
    SELECT posts.id, posts.title, posts.content, users.username, posts.created_at 
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/** ✅ 특정 게시글 가져오기 (username 포함) */
app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const sql = `
    SELECT posts.id, posts.title, posts.content, users.username, posts.created_at 
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
  `;

  db.get(sql, [postId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });

    console.log("✅ 반환된 게시글 데이터:", row);
    res.json(row);
  });
});

/** ✅ 게시글 작성 (로그인한 사용자만 가능) */
app.post("/posts", verifyToken, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id; // 🔹 JWT에서 user_id 가져오기
  const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (!title || !content) {
    return res.status(400).json({ error: "제목과 내용을 입력하세요!" });
  }

  const sql = "INSERT INTO posts (title, content, user_id, created_at) VALUES (?, ?, ?, ?)";
  db.run(sql, [title, content, userId, createdAt], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, title, content, user_id: userId, created_at: createdAt });
  });
});

/** ✅ 회원가입 (비밀번호 해싱 + 중복 체크) */
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "아이디와 비밀번호를 입력하세요!" });
  }

  //  중복 아이디 체크
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (user) return res.status(400).json({ error: "이미 존재하는 아이디입니다." });

    // 비밀번호 해싱 후 저장
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "비밀번호 해싱 중 오류 발생" });
      }

      db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, username });
      });
    });
  });
});

/** ✅ 로그인 (JWT 발급) */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "아이디 또는 비밀번호가 틀렸습니다." });

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(500).json({ error: "비밀번호 검증 중 오류 발생" });

      if (result) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
      } else {
        res.status(401).json({ error: "아이디 또는 비밀번호가 틀렸습니다." });
      }
    });
  });
});

/** ✅ 내 프로필 정보 가져오기 */
app.get("/profile", verifyToken, (req, res) => {
  const sql = "SELECT id, username FROM users WHERE id = ?";
  db.get(sql, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(user);
  });
});

/** ✅ 내가 작성한 게시글 가져오기 */
app.get("/user-posts", verifyToken, (req, res) => {
  const sql = "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC";
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/** ✅ 서버 실행 */
app.listen(5000, () => console.log("✅ 백엔드 실행 중: http://localhost:5000"));
