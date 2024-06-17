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
          maxAge: 24 * 60 * 60 * 1000,
          secure: false  // 쿠키 유효 시간 (예: 1일)
      },
  }),
);
// 여기서부터 백엔드서버
app.use(cors({
  origin: 'http://localhost:8000', // 허용할 출처를 명시
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true,
  cookie: { secure: false } 
})); // 미들웨어가 무엇인가?  
app.options('*', cors()); 

const checkSessionID = (req, res, next) => {
  if (req.sessionID!= null) { // 만약 세션 아이디가 존재한다면 => 
      next(); // 다음 단계로 진행
  } else {
      console.log('세션 ID가 없습니다.');
      res.status(401).send('세션 ID가 필요합니다.');
      // 여기서 윈도우는 의미가 없음 ,, 
  }
};
// 클라이언트의 요청 -> 특정 함수로 요청 -> userId가 없는 상태로 접근 불가
// 여기는 그냥 날짜설정 코드 / 
// Express 애플리케이션에 정적 파일 제공 설정 
// patch - chrome, chrome

// 여기서부터 백엔드서버

app.get("/allposts",userController.allposts);
app.get("/posts/:postId",userController.posts);
app.get("/comments/:postId",userController.comments);
app.get("/user/info",userController.userData);
app.post("/login",checkSessionID,userController.login);
app.post("/logout",checkSessionID,userController.logout);
app.post("/submit",checkSessionID ,userController.submit);
app.post("/join",userController.join);
app.post("/info",checkSessionID ,userController.info);
app.post("/removePost",checkSessionID ,userController.removePost);
app.post("/removeComment",checkSessionID ,userController.removeComment);
app.post("/addComment",checkSessionID ,userController.addComment);
app.post("/fixNickname",checkSessionID, userController.fixNickname);
app.post("/fixPassword",checkSessionID ,userController.fixPassword);




app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
