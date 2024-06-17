const fs = require("fs");
const jwt = require('jsonwebtoken');
const session = require('express-session');
const currentTimeInMilliseconds = Date.now();
const currentTime = new Date(currentTimeInMilliseconds);

const year = currentTime.getFullYear();
const month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
const day = ("0" + currentTime.getDate()).slice(-2);
const hour = ("0" + currentTime.getHours()).slice(-2);
const minute = ("0" + currentTime.getMinutes()).slice(-2);
const second = ("0" + currentTime.getSeconds()).slice(-2);
const SECRET_KEY = 'your-secret-key';
const bcrypt = require('bcryptjs');
require('dotenv').config(); // dotenv 패키지를 사용하여 환경 변수 로드
const secretKey = process.env.SECRET_KEY;

const str = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'alan',
  password: 'password',
  database: 'information_db'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류:', err.stack);
    return;
  }
  console.log('MySQL에 연결되었습니다.');
});
async function login(req,res){
  const {userId,password} = req.body;
  req.session.userId = userId;

  const users = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    db.query(sql, [req.session.userId], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return reject(new Error('사용자를 찾을 수 없습니다.'));
      resolve(result[0]);
    });
  });
  if(users == null){
    return res.status(400).send('No exist user');
  } // 존재하지 않는 유저로 400번 응답 보낸다.



  return res.status(200).json({
    status: 200,
    message: `환영합니다, ${userId}님!`,
    data: {
        //XXX data로 세션을 리턴하면 보안상의 이유로 안된다.
        //XXX 우리는 세션 발급한 것을 보기 위해 바디로 리턴
        sessionID: req.sessionID, 
    },
});
}; // DB로 완전히 바꾸기 완료 

function logout(req,res) {
  req.session.destroy(err => {
    if(err){
      return res.status(500).send('Logout Failed!');
   }
   res.send('Logout!');
  });
} // DB로 바꿀 필요 없음

const submit = async (req, res) => { // 이제 게시물 작성 하나 끝났당 ㅋㅋ 
  // 요청 본문에서 파싱된 JSON 데이터 사용
  console.log("세션 정보", req.session);
  console.log('받은 데이터:', req.body);

  if (req.session.userId == null) {
    return res.status(401).send("로그인을 해야 합니다.");
  }

  try {
    // 사용자 정보 가져오기
    const user = await new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE user_id = ?';
      db.query(sql, [req.session.userId], (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return reject(new Error('사용자를 찾을 수 없습니다.'));
        resolve(result[0]);
      });
    });

    console.log('사용자 정보:', user);

    // 새로운 post_id를 결정하기 위해 현재 Posts 테이블의 최대 postId를 가져오기
    const maxPostId = await new Promise((resolve, reject) => {
      const sql = 'SELECT MAX(postId) AS maxPostId FROM Posts';
      db.query(sql, (err, result) => {
        if (err) return reject(err);
        resolve(result[0].maxPostId);
      });
    });

    const newPostId = maxPostId + 1;

    const info = {
      post_id: newPostId,
      title: req.body.title,
      likes: 0,
      comments: 0,
      views: 0,
      nickname: user.nickName, // 사용자 닉네임
      dates: str, // 현재 날짜 및 시간
      innerText: req.body.innerText,
      img: req.body.img,
      userId: req.session.userId
    };

    // 새로운 포스트 삽입
    const insertPost = await new Promise((resolve, reject) => {
      const sql = `INSERT INTO Posts(postId, title, like_count, comment_count, view_count, nickname, user_id, dates, post_detail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(sql, [
        info.post_id, info.title, info.likes, info.comments, info.views, info.nickname, info.userId, info.dates, info.innerText
      ], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    console.log('포스트 삽입 결과:', insertPost);

    res.json(info);

  } catch (err) {
    console.error('오류 발생:', err);
    res.status(500).send('서버 오류');
  }
  
}; // DB로 완전히 바꾸기 완료
function join (req, res){ // 회원가입 구현 완료 
    // 요청 본문에서 파싱된 JSON 데이터 사용
    console.log('받은 데이터:', req.body);
    
    const info2 = {
      "userid": req.body.userid,
      "password": req.body.password,
      "nickname": req.body.nickname,
    }
    const sql = "insert into Users(user_id,password,joinTime,nickName,image) values(?,?,?,?,?)";
  db.query(sql,[info2.userid,info2.password,str,info2.nickname],(err,results,fields) => {
    console.log("err",err);
    console.log("results",results);
    console.log("fields",fields);
  });
  
    res.json(info2);
  } // DB로 완전히 적용 완료 !!!!!!!!! 

const info = async (req,res) => { // 수정 ,, 겨우 됐다,, 아오 ,, ^^ 
 
  const information = {
    "title" : req.body.title,
    "innerText":req.body.innerText,
    "postId":req.body.post_id
  } 
  if(!req.session.userId){
    return res.status(401).send("로그인을 해주세요.");
  }
  const user = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Posts WHERE postId = ? ';
    db.query(sql, [information.postId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
  
  if(user.user_id!=req.session.userId){
    return res.status(401).send("본인이 작성한 글이 아닙니다");
  }
  const sql = "update Posts set post_detail = ?,title = ? where postId = ?";
  db.query(sql,[information.innerText,information.title,information.postId],(err,results,fields) => {
    console.log("err",err);
    console.log("results",results);
    console.log("fields",fields);
    res.json(results);
  });
} // DB 적용 완전히 완료 !!!!!!!!!!!!!!!!

const removePost  = async (req,res) => {
  // req.body는 postId
  const postId = req.body.postId;
  
    if(!req.session.userId){
      return res.status(401).send("로그인을 먼저 해주세요!");
    }
    const user = await new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Posts WHERE postId = ? ';
      db.query(sql, [postId], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
    
    if(user.user_id!=req.session.userId){
      return res.status(401).send("본인이 작성한 글이 아닙니다");
    }
    const sql = "delete from Posts where postId = ?";
    db.query(sql,[postId],(err,results,fields) => {
    console.log("err",err);
    console.log("results",results);
    console.log("fields",fields);
    res.json(results);
  });
    
  

} // DB 적용 완전히 완료 !!!!!!!!!!!!!!!!!!! 

function removeComment(req,res){
  const postId = req.body.post_id;
  const commentNumber = req.body.commentNumber;
  // post id가 같고 // comment id도 같은 애를 지운다
  if(req.session.userId == null){
    return res.status(401).send("로그인을 해야 합니다.");
  } // 여기 세션 아이디가 null인지에 대한 유무 확인
  
    const sql = "delete from Comments where comment_number = ? and postId = ?";
    db.query(sql,[commentNumber,postId],(err,results,fields) => {
     console.log("err",err);
     console.log("results",results);
     console.log("fields",fields);
  });
   
    const sql2 = "update Comments set comment_number = comment_number -1 where comment_number > ?";
    db.query(sql2,[commentNumber],(err,results,fields) => {
     console.log("err",err);
     console.log("results",results);
     console.log("fields",fields);
     res.json(results);
  }); 


} // 댓글 삭제도 일단 DB 적용 완전히완료 !!!!!!!!!!!
async function addComment(req,res){
  const postId = req.body.postId;
  const comment = req.body.comment;
  const user = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    db.query(sql, [req.session.userId], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return reject(new Error('사용자를 찾을 수 없습니다.'));
      resolve(result[0]);
    });
  });

  console.log('사용자 정보:', user);

  // 새로운 post_id를 결정하기 위해 현재 Posts 테이블의 최대 postId를 가져오기
  const maxCommentNumber = await new Promise((resolve, reject) => {
    const sql = 'SELECT MAX(comment_number) AS maxCommentNumber FROM Comments';
    db.query(sql, [postId],(err, result) => {
      if (err) return reject(err);
      resolve(result[0].maxCommentNumber);
    });
  });

  const newCommentNumber = maxCommentNumber + 1;
  

      const sql2 = `INSERT INTO Comments(comment_number,postId,userId,comment_postTime,comment_detail,nickname) VALUES (?, ?, ?, ?, ?,?)`;
      db.query(sql2, [newCommentNumber,postId,req.session.userId,str,comment,user.nickName], (err, result) => {
        if (err) return reject(err);
        console.log("err",err);
        console.log("results",result);
      });
  
    const arr = {
      "post_id" : postId,
      "nickname": user.nickName,
      "dates":str,
      "comment_detail":comment,
      "comment_number" : newCommentNumber,
      "userId": req.session.userId
    }

    res.json(arr);
} // 댓글 추가 DB 완전히 변환 완료

function fixNickname(req,res){
  const idnumber = req.body.idnumber;
  const nickname = req.body.nickname;
  
    const sql = "update users set nickName = ? where user_id = ?";
    db.query(sql,[nickname,req.session.userId],(err,results,fields) => {
     console.log("err",err);
     console.log("results",results);
     console.log("fields",fields);
     res.json(results);
  });
    
}// 여기도 DB로 전환 완료 !! 
const fixPassword = (req,res) => {
  const password = req.body.password;
  const idnumber = req.body.idnumber

    const sql = "update users set password = ? where user_id = ?";
    db.query(sql,[password,req.session.userId],(err,results,fields) => {
     console.log("err",err);
     console.log("results",results);
     console.log("fields",fields);
     res.json(results);
  });
    
  
} // DB로 변환 완료 !!!!!!! 
const userData = async (req,res) => {
  
  const sql = 'SELECT * FROM Users';
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      res.json(result);
    });
    
  }// 변환 완료 !!!  
  


const posts = async (req,res) => {
  const { postId } = req.params;
  const numericPostId = parseInt(postId, 10);

  try {
    // 사용자 정보 가져오기
    const user = await new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Posts WHERE postId = ?';
      db.query(sql, [numericPostId], (err, result) => {
        if (err) {
          return reject(new Error('데이터베이스 쿼리 중 오류 발생: ' + err.message));
        }
        if (result.length === 0) {
          return reject(new Error('사용자를 찾을 수 없습니다.'));
        }
        resolve(result[0]);
      });
    });
  console.log(user);
    // 사용자 정보가 성공적으로 조회된 경우 응답
    res.json(user);
  
  } catch (err) {
    // 오류 발생 시 응답
    console.error('오류 발생:', err.message);
    res.status(500).send('서버 오류: ' + err.message);
  }
  
} // 여기도 문제 없음 !!!!!! 
const comments = (req,res) => {
  const { postId } = req.params;
  const numericPostId = parseInt(postId, 10);
  try {
    db.query('SELECT * FROM Comments WHERE postId = ?', [numericPostId], (err, results) => {
      if (err) {
        console.error('쿼리 오류:', err);
        return res.status(500).send('서버 오류');
      }
    
      // 가져온 데이터를 JSON 형식으로 클라이언트에 응답
      res.json(results);
    });
  } catch (err) {
    console.error('오류 발생:', err);
    res.status(500).send('서버 오류');
  }
} // 여기도 문제 없음 !!!!!!!!!! 
const allposts = async (req,res) => {
  try {
    // Posts 테이블에서 모든 행을 가져오기
    db.query('SELECT * FROM Posts', (err, results) => {
      if (err) {
        console.error('쿼리 오류:', err);
        return res.status(500).send('서버 오류');
      }

      // 가져온 데이터를 JSON 형식으로 클라이언트에 응답
      res.json(results);
    });
  } catch (err) {
    console.error('오류 발생:', err);
    res.status(500).send('서버 오류');
  }
  
    
  
}

/*
const arr = {
    "comment" : inComment.innerText,
    "postId":postId,
    "commentNumber":commentNumber
  }
*/
 /*const arr = {
  "idnumber": idnumber,
  "nickname": inputId
}
fetch("/fixNickname", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },*/

module.exports = {
    removeComment,
    removePost,info,join,submit,addComment,fixNickname,fixPassword,login,logout,
    userData,comments,allposts,posts
};


/*
for (let i = 0; i<existData.comment_info.length; i++){
      if (existData.comment_info[i].postId == postId && existData.comment_info[i].comment_number == commentNumber){
        existData.comment_info[i].comment_detail = comment;
      } 수정로직
*/