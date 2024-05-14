const fs = require("fs");
// 웹 서버가 사용할 포트 번호를 정의합니다.
const port = 8000;
const express = require("express");
const path = require("path");
const app = express();

// 정적 파일을 제공할 경로를 설정합니다.
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
app.use(express.static('public'));

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
app.get("/fix-info", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "fix-info.html"));
});
app.get("/fix-info2", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "fix-info2.html"));
});
app.get("/post-fix", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "post-fix.html"));
});
app.get("/join", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "join.html"));
});
app.listen(port, () => {
  console.log(`Frontend server is running on port ${port}`);
});