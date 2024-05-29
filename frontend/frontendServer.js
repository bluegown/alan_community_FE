const fs = require("fs");
// 웹 서버가 사용할 포트 번호를 정의합니다.
const port = 8000;
const express = require("express");
const path = require("path");
const app = express();

// 정적 파일을 제공할 경로를 설정합니다.
const publicPath = path.join(__dirname);
app.use(express.static(publicPath));
app.use(express.static('frontend'));

const checkSessionID = (req, res, next) => {
  if (req.sessionID) { // 만약 세션 아이디가 존재한다면 => 
      next(); // 다음 단계로 진행
  } else {
      console.log('세션 ID가 없습니다.');
      res.status(401).send('세션 ID가 필요합니다.');
      window.location.href = "/"; // 로그인 창으로 돌려보낸다
  }
};

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "login.html"));
});

app.get("/post", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "post.html"));
});
app.get("/post-detail", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "post-detail.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "login.html"));
});
app.get("/write-post", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "write-post.html"));
});
app.get("/fix-info",(req, res) => {
  res.sendFile(path.join(publicPath, "html", "fix-info.html"));
});
app.get("/fix-info2",  (req, res) => {
  res.sendFile(path.join(publicPath, "html", "fix-info2.html"));
});
app.get("/post-fix",(req, res) => {
  res.sendFile(path.join(publicPath, "html", "post-fix.html"));
});
app.get("/join", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "join.html"));
});
app.listen(port, () => {
  console.log(`Frontend server is running on port ${port}`);
});