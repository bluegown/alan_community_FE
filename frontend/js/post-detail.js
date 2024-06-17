// 1번조건 구현 완료
// 2번조건 구현 완료
// 3번조건 구현 완료
// 4번조건 구현 완료
// 5번조건도 구현 완료(사실 좀빵꾸나긴했는데 되긴됨)
const checkButton = document.getElementById('post-delete');
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

const lengthCheck = (element) => {
  if (element >= 100000) return "100K";
  if (element >= 10000) return "10K";
  if (element >= 1000) return "1K";
  return element;
};
// post detail은 끝!!!!!!!!!

const post = (elements) => {
  const fixTitle = document.querySelector(".post-title");
  const nickName = document.getElementById("nickName");
  const dates = document.getElementById("dates");
  const image = document.getElementById("fix-image");
  const inputText = document.getElementById("inputText");
  const views = document.getElementById("number");
  const comments = document.getElementById("number2");
  const deleteButton = document.getElementsByClassName("delete");
  let commentNumber = 0;
  fixTitle.innerText = elements.title;
  nickName.innerText = elements.nickname;
  dates.innerText = elements.dates;
  image.src = elements.post_image;
  inputText.innerText = elements.post_detail;
  views.innerText = lengthCheck(elements.view_count);
  comments.innerText = lengthCheck(elements.comment_count);
  
}


const deletePost = () => {
  const info = {
    postId: postId,
  };
  fetch("http://localhost:3000/removePost", {

    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
    credentials: 'include'
  })
    .then((response) => {
      // 응답을 JSON으로 파싱
      if(response.ok){
      return response.json();
      }
      else{
        alert("본인의 글이 아니면 삭제할 수 없습니다.");
        window.location.href = "/";
      }
    })
    .then((data) => {
      console.log("서버 응답:", data);
    });

}

const fixComment = (commentNumber,postId,innerText) => {

  const temp = {
    "commentNumber" : commentNumber,
    "postId":postId,
    "comment_detail" : innerText
  }
  fetch("http://localhost:3000/fixComment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(temp),
  })
    .then((response) => {
      // 응답을 JSON으로 파싱
      return response.json();
    })
    .then((data) => {
      console.log("서버 응답:", data);
    });


}

const deleteComment = (i) => {

  
  const temp = {
    post_id: postId,
    commentNumber: i,
  };
  fetch("http://localhost:3000/removeComment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(temp),
    credentials : 'include'
  })
    .then((response) => {
      // 응답을 JSON으로 파싱
      return response.json();
    })
    .then((data) => {
      console.log("서버 응답:", data);
    });

} // 댓글 삭제

const writeComment = (elements) => {

  const entireInfo = document.createElement("div");
  const writerInfo = document.createElement("div");
  writerInfo.classList.add("writer-info"); // div writer-info
  const boxInfo = document.createElement("div");
  boxInfo.classList.add("box-info"); // div class= boxinofo
  const parent = document.querySelector("#parent"); // parent를 찾아준다 얜 냅둘거임

  const circle = document.createElement("div");
  circle.classList.add("circle");

  const commentWriter = document.createElement("div");
  commentWriter.classList.add("comment-writer");

  const commentDates = document.createElement("div");
  commentDates.classList.add("comment-dates");

  parent.appendChild(entireInfo);
  entireInfo.appendChild(boxInfo);
  boxInfo.appendChild(writerInfo);
  writerInfo.appendChild(circle);
  writerInfo.appendChild(commentWriter);
  writerInfo.appendChild(commentDates);

  commentWriter.innerText = elements.nickname;
  commentDates.innerText = elements.comment_postTime;

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");
  boxInfo.appendChild(buttons);

  const commentFix = document.createElement("button");
  commentFix.setAttribute("type", "button");
  commentFix.setAttribute("class", "fix");
  commentFix.innerText = "수정";
  commentFix.addEventListener("click", function (event) {
    event.preventDefault();
    const buttonText = document.querySelector(".button"); // 댓글 등록 버튼
    const fixText = document.getElementById("intext"); // 댓글 내용 input쪽에
      fixText.innerText = ""; // 댓글 입력 창에 불러오기
      fixText.offsetHeight; // 
      buttonText.value = "댓글 수정"; // 버튼을 댓글 입력 -> 댓글 수정으로 바꾸고
      buttonText.offsetHeight; // 렌더링시켜서 결과물을 눈에 ƒ보이게 한다
      
      if(buttonText.value == "댓글 수정"){
        buttonText.addEventListener('click',(e)=> {
          fixComment(elements.comment_number,fixText.value);
          
          window.location.href = `post-detail?id=${postId}`;
        });
      }
      
    })
  const commentDelete = document.createElement("button");
  commentDelete.setAttribute("type", "button");
  commentDelete.setAttribute("class", "delete");
  commentDelete.innerText = "삭제";
  commentDelete.addEventListener("click", function (event) {
    event.preventDefault();
    let separate = document.getElementById("separate");
    
     
      separate.innerText = "댓글을 삭제하시겠습니까?";
      checkButton.addEventListener('click',(e)=> {
        deleteComment(elements.comment_number);
        
        window.location.href = `post-detail?id=${postId}`;
      });
    modal.style.display = "block";
    document.body.style = "overflow : hidden";
  });

  buttons.appendChild(commentFix);
  buttons.appendChild(commentDelete);

  const commentDetail = document.createElement("p");
  commentDetail.classList.add("commentDetail");
  entireInfo.appendChild(commentDetail);
  commentDetail.innerText = elements.comment_detail;

}




const b = document.getElementById("behind");
b.addEventListener("click", () => {
  window.location.href = "post";
});

const deleteButton = document.getElementsByClassName("delete");
const registerButton = document.querySelector(".button");
const modal = document.getElementById("modal");

const addComment = (postId) =>{
  const buttonText = document.querySelector(".button"); // 댓글 등록 버튼
  const inComment = document.getElementById("intext"); // 댓글 내용 input쪽에
  const arr = {
    "comment" : inComment.value,
    "postId": parseInt(postId),
  }
  if(buttonText.value == "댓글 등록"){
      fetch("http://localhost:3000/addComment",{
    method : "POST",
    headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(arr),
      credentials : 'include' // json  형식으로 
    })
.then((response) => {
// 응답을 JSON으로 파싱
return response.json();
})
.then((data) => {
  location.reload(); // 이거로 새로고침 
  
})

  }

};


const cancelButton = document.getElementById("cancel");

cancelButton.addEventListener("click", function (event) {
  modal.style.display = "none";
  document.body.style = "overflow : auto";
});

const commentButton = document.getElementById("comment-button");
const commentInput = document.getElementById("intext");

commentInput.addEventListener("input", function (event) {
  commentButton.style.backgroundColor = "#7F6AEE";
  commentButton.offsetHeight;
  var inputText = event.target.value;
  if (inputText.length === 0) {
    commentButton.style.backgroundColor = "#ACA0EB";
  }
  commentButton.offsetHeight;
});

// 여기까지가 정적 할당

const fix = document.getElementsByClassName("fix"); // 모든 수정버튼을 모아둔 fix array
const commentText = document.getElementById("intext"); // intext는 textarea를 의미
fix[0].addEventListener("click", () => {
  window.location.href = `post-fix?id=${postId}`; 

})




registerButton.addEventListener('click',() =>{
  addComment(postId);

});


fetch(`http://localhost:3000/posts/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include' 
  })
  .then(response => response.json()) // 응답을
  .then((data) => {
    // 데이터 처리

    console.log(data);
    post(data);

    
 
    

  })
fetch(`http://localhost:3000/comments/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include' 
  })
  .then(response => response.json()) // 응답을
  .then((data) => {
  
    if(data){
      data.forEach((item) => {
        writeComment(item);
      })
    }
  })

  const deleteEventListener = () => {

    for (let i = 0; i < deleteButton.length; i++) {
      deleteButton[i].addEventListener("click", function (event) {
        event.preventDefault();
        let separate = document.getElementById("separate");
        if (i == 0) {
          separate.innerText = "게시글을 삭제하시겠습니까?";
          checkButton.addEventListener('click',(e)=> {
            deletePost();
            window.location.href = "post";
          });
        } 
          
        
        const modal = document.getElementById("modal");
        modal.style.display = "block";
        document.body.style = "overflow : hidden";
      });
    }
  
  }
  deleteEventListener();
// 여기까지가 fetch내에있는 then 부분

// 여기서 댓글삭제 vs 게시글삭제에서 멈췄다
// 나머진 내일 할래요


// 4번 조건은 키를 입력하는 순간부터, comment!="" 라면, color change
// if comment가 0이라면 comment부분 display : none;

// 1번조건 완
// 2번조건도 완
// 3번조건도 완
// 4번조건 완
// 5번조건 완,,,,,,,,,,,
