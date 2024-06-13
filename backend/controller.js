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

function login(req,res){
  const {userId,password} = req.body;
 
  let existingData = {};
    try{
      existingData = JSON.parse(fs.readFileSync('../frontend/data.json', 'utf8'));
    }
    catch(err){
      console.error('파일을 읽을 수 없습니다.', err);
    }
  const user = existingData.users.find(user => user.userid === userId);
  if(user == null){
    return res.status(400).send('No exist user');
  } // 존재하지 않는 유저로 400번 응답 보낸다.

 session.userId = userId;

  return res.status(200).json({
    status: 200,
    message: `환영합니다, ${userId}님!`,
    data: {
        //XXX data로 세션을 리턴하면 보안상의 이유로 안된다.
        //XXX 우리는 세션 발급한 것을 보기 위해 바디로 리턴
        sessionID: req.sessionID, 
    },
});
};

function logout(req,res) {
  req.session.destroy(err => {
    if(err){
      return res.status(500).send('Logout Failed!');
   }
   res.send('Logout!');
  });
}
function authenticate(req,res,next){
  if(!req.session.userId){
    return res.status(401).send("로그인을 먼저 해주세요.");
  }// userId가 존재하지 않는 경우
  next();
}
async function checkAuth(){
  const token = localStorage.getItem('token');


  if(!token){
    alert("Not authorized");
    window.location.href = 'login';
    return;
  }

} // 인증된지 아닌지 확인하는 함수
const submit = (req, res) => { // 이제 게시물 작성 하나 끝났당 ㅋㅋ 
  // 요청 본문에서 파싱된 JSON 데이터 사용
  console.log('받은 데이터:', req.body);
  let existingData = {};
  try{
    existingData = JSON.parse(fs.readFileSync('../frontend/data.json', 'utf8'));
  }
  catch(err){
    console.error('파일을 읽을 수 없습니다.', err);
  }
  if(req.session.sessionID == null){
    return res.status(401).json.send("로그인을 해야 합니다.");
  } // 여기 세션 아이디가 null인지에 대한 유무 확인
  const information = existingData.users.find(user => user.userid == req.session.userId)
  const info = {
    "post_id": (existingData.info.length),
    "title": req.body.title,
    "likes": 0,
    "comments":0,
    "views":0,
    "nickname":information.nickname,
    "dates": str,
    "innerText": req.body.innerText,
    "img":req.body.img // 여기에 img src를 
    
  }
  existingData.info.push(info);

  const sql = "insert into postInfo(user_id,postTime,like_count,comment_count,view_count,post_detail) values(?,?,?,?,?,?)";
  db.query(sql,[req.session.userId,'2024-06-03 22:35:02',0,0,0,info.innerText],(err,results,fields) => {
    console.log("err",err);
    console.log("results",results);
    console.log("fields",fields);
  });
  fs.writeFile('../frontend/data.json',JSON.stringify(existingData, null, 4), err => {
    if(err){
      return res.status(500).send("파일 쓰기 불가능");
    }
  });
  res.json(existingData);
};
function join (req, res){ // 회원가입 구현 완료 
    // 요청 본문에서 파싱된 JSON 데이터 사용
    console.log('받은 데이터:', req.body);
    let existData = {};
    try{
      existData = JSON.parse(fs.readFileSync('../frontend/data.json', 'utf8'));
    }
    catch(err){
      console.error('파일을 읽을 수 없습니다.', err);
    }
    const info2 = {
      "userid": req.body.userid,
      "password": req.body.password,
      "nickname": req.body.nickname,
      "idnumber": existData.users.length + 1
    }
  
    existData.users.push(info2);
    fs.writeFile('../frontend/data.json',JSON.stringify(existData, null, 4), err => {
      if(err){
        return res.status(500).send("파일 쓰기 불가능");
      }
     
  
    });
    res.json(info2);
  }

const info = (req,res) => { // 수정 ,, 겨우 됐다,, 아오 ,, ^^ 
  let existData = JSON.parse(fs.readFileSync('../frontend/data.json', 'utf8'));
  const info = {
    "title" : req.body.title,
    "innerText":req.body.innerText,
    "postId":req.body.post_id
  } 
  if(!req.session.userId){
    return res.status(401).send("로그인을 해주세요.");
  }
  const data = existData.info.find(x=> x.post_id == info.postId);
  if(data){
    if(data.userId!=req.session.userId){
      return res.status(401).send("본인이 작성하지 않은 글입니다.");
    }
  }
  existData.info[req.body.post_id].title = req.body.title;
  existData.info[req.body.post_id].innerText = req.body.innerText;
  fs.writeFileSync('../frontend/data.json', JSON.stringify(existData, null, 2));
    res.json(info);
}

const removePost  = (req,res) => {
  // req.body는 postId
  const postId = req.body.postId;
  fs.readFile('../frontend/data.json', 'utf8', (err, data) => {
    if (err) {
        // 에러 처리
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
    }
    if(!req.session.userId){
      return res.status(401).send("로그인을 먼저 해주세요!");
    }
    let existData = JSON.parse(data);
    const mydata = existData.info.find(x => x.post_id == postId);
    if(!mydata){
      return res.status(401).send("empty");
    }    
    if(mydata.userId!=req.session.userId){
      return res.status(401).send("본인이 작성한 글이 아닙니다");
    }
    existData.info = existData.info.filter(item => item.post_id!= postId);
    fs.writeFile('../frontend/data.json', JSON.stringify(existData, null, 2), err => {
        if (err) {
            // 에러 처리
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Error writing file' });
        }
        
        // 클라이언트에게 postId를 응답
        res.json(existData);
    });
});
} // 삭제 구현 완료 !! 

function removeComment(req,res){
  const postId = req.body.post_id;
  const commentNumber = req.body.commentNumber;
  // post id가 같고 // comment id도 같은 애를 지운다
  fs.readFile('../frontend/data.json', 'utf8', (err, data) => {
    if (err) {
        // 에러 처리
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
    }
    let existData2 = JSON.parse(data);
    // 포스트 아이디가 다른 애들은 남긴다. ||    
    // 포스트 아이디가 같아도 
    // 필터링 
    existData2.comment_info = existData2.comment_info.filter(item => (item.post_id!=postId) || (item.post_id == postId && item.comment_number!=commentNumber));
    //를 남겨두는 것이다 
    // 파일을 비동기적으로 쓰기 
    for(let i = 0; i<existData2.comment_info.length; i++){
      if(existData2.comment_info[i].comment_number > commentNumber){
        existData2.comment_info[i].comment_number -= 1;
      }
    } // 이 로직으로 하면 되지 않을까?
   

    fs.writeFile('../frontend/data.json', JSON.stringify(existData2, null, 2), err => {
        if (err) {
            // 에러 처리
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Error writing file' });
        }
        res.json(existData2);
    });
});
}
function addComment(req,res){
  const postId = req.body.postId;
  const comment = req.body.comment;
  fs.readFile('../frontend/data.json', 'utf8', (err, data) => {
    if (err) {
        // 에러 처리
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
    }
    let existData = JSON.parse(data);
    let commentNumber = 0;
    for (let i = 0; i<existData.comment_info.length; i++){
      if (existData.comment_info[i].post_id == postId){
        commentNumber = commentNumber + 1;
      }
    }
    const arr = {
      "post_id" : postId,
      "nickname": "임시 댓글 작성자",
      "dates":str,
      "comment_detail":comment,
      "comment_number" : commentNumber + 1
    }
/*
"post_id": 1,
      "nickname": "hazel",
      "dates": "2024-04-21 02:28:22",
      "comment_detail": "아 네 저두 그렇게 생각해요",
      "comment_number": 2
*/

    existData.comment_info.push(arr);
    
    fs.writeFile('../frontend/data.json', JSON.stringify(existData, null, 2), err => {
        if (err) {
            // 에러 처리
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Error writing file' });
        }
        
        // 클라이언트에게 postId를 응답
        res.json(existData);
    });
});

}

function fixNickname(req,res){
  const idnumber = req.body.idnumber;
  const nickname = req.body.nickname;
  fs.readFile('../frontend/data.json', 'utf8', (err, data) => {
    if (err) {
        // 에러 처리
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
    }
    let existData = JSON.parse(data);
    for(let i = 0; i<existData.users.length; i++){
      if(existData.users[i].idnumber == idnumber){
        existData.users[i].nickname = nickname;
      }
    } // 수정
    
    
    fs.writeFile('../frontend/data.json', JSON.stringify(existData, null, 2), err => {
        if (err) {
            // 에러 처리
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Error writing file' });
        }
        
        // 클라이언트에게 postId를 응답
        res.json(existData);
    });
});
}
function fixPassword(req,res){
  const password = req.body.password;
  const idnumber = req.body.idnumber;
  fs.readFile('../frontend/data.json', 'utf8', (err, data) => {
    if (err) {
        // 에러 처리
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
    }
    let existData = JSON.parse(data);
    for(let i = 0; i<existData.users.length; i++){
      if(existData.users[i].idnumber == idnumber){
        existData.users[i].password = password;
      }
    } // 수정
    
    
    fs.writeFile('../frontend/data.json', JSON.stringify(existData, null, 2), err => {
        if (err) {
            // 에러 처리
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Error writing file' });
        }
        
        // 클라이언트에게 postId를 응답
        res.json(existData);
    });
});
}
const userData = (req,res) => {
  fs.readFile('../frontend/data.json', 'utf8', (err, data) => {
    if (err) {
        // 에러 처리
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
    }
    let existData = JSON.parse(data);
    let users = existData.users;
    if(users){
      res.json(users);
    }
  }
  )
}

const posts = (req,res) => {
  const { postId } = req.params;
  const numericPostId = parseInt(postId, 10);
  fs.readFile('../frontend/data.json', 'utf8', (err, data) => {
    if (err) {
        // 에러 처리
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
    }
    let existData = JSON.parse(data);
    const item = existData.info.find(d => d.post_id === numericPostId);
    if(item){
      res.json(item);
    }
    
  })
}
const comments = (req,res) => {
  const { postId } = req.params;
  const numericPostId = parseInt(postId, 10);
  let existData = {}
  fs.readFile('../frontend/data.json', 'utf8', (err, data) => {
    if (err) {
        // 에러 처리
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
    }
    existData = JSON.parse(data);
    const item = existData.comment_info.filter(d => d.post_id === numericPostId);
    if(item){
      res.json(item);
    }
  })
}
const allposts = (req,res) => {
 
  fs.readFile('../frontend/data.json', 'utf8', (err, data) => {
    if (err) {
        // 에러 처리
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
    }
    let existData = JSON.parse(data);
    const item = existData.info;
    if(item){
      res.json(item);
    }
    
    
  })
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
    removePost,info,join,submit,addComment,fixNickname,fixPassword,login,checkAuth,logout,
    authenticate,userData,comments,allposts,posts
};


/*
for (let i = 0; i<existData.comment_info.length; i++){
      if (existData.comment_info[i].postId == postId && existData.comment_info[i].comment_number == commentNumber){
        existData.comment_info[i].comment_detail = comment;
      } 수정로직
*/