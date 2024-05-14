// express 모듈을 불러옵니다.
const fs = require("fs");
const port = 3000;
const express = require("express");
const path = require("path");
const app = express();
// 정적 파일을 제공할 경로를 설정합니다.

const publicPath = path.join(__dirname);
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json({ extended: true }));
const session = require('express-session');
const userController = require("./controller.js");
const cors = require('cors');
// 여기는 그냥 날짜설정 코드 / 
// Express 애플리케이션에 정적 파일 제공 설정 
// patch - chrome, chrome
app.use(
  session({
      secret: 'yourSecretKey',
      saveUninitialized: true,
      resave: false,
      cookie: {
          maxAge: 24 * 60 * 60 * 1000, // 쿠키 유효 시간 (예: 1일)
      },
  }),
);
// 여기서부터 백엔드서버
app.use(cors({
  origin: 'http://localhost:8000', // 허용할 출처를 명시
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
})); 
app.options('*', cors());


// 여기는 그냥 날짜설정 코드 / 
// Express 애플리케이션에 정적 파일 제공 설정 
// patch - chrome, chrome

// 여기서부터 백엔드서버
app.post("/submit",userController.submit);
app.post("/join",userController.join);
app.post("/info",userController.info);
app.post("/removePost",userController.removePost);
app.post("/removeComment",userController.removeComment);
app.post("/addComment",userController.addComment);
app.post("/fixNickname",userController.fixNickname);
app.post("/fixPassword",userController.fixPassword);

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
