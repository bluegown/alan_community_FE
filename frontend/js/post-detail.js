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
  let commentNumber = 0;
  fixTitle.innerText = elements.title;
  nickName.innerText = elements.nickname;
  dates.innerText = elements.dates;
  image.src = elements.img;
  inputText.innerText = elements.innerText;
  views.innerText = lengthCheck(elements.views);
  comments.innerText = lengthCheck(elements.comments);

}

const deletePost = () => {
  const info = {
    postId: postId,
  };
  fetch("/removePost", {

    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then((response) => {
      // 응답을 JSON으로 파싱
      return response.json();
    })
    .then((data) => {
      console.log("서버 응답:", data);
    });

}

const fixComment = (commentNumber,postId) => {

  const temp = {
    "commentNumber" : commentNumber,
    "postId":postId
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
  commentDates.innerText = elements.dates;

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");
  boxInfo.appendChild(buttons);

  const commentFix = document.createElement("button");
  commentFix.setAttribute("type", "button");
  commentFix.setAttribute("class", "fix");
  commentFix.innerText = "수정";

  const commentDelete = document.createElement("button");
  commentDelete.setAttribute("type", "button");
  commentDelete.setAttribute("class", "delete");
  commentDelete.innerText = "삭제";

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

  const inComment = document.getElementById("intext"); // 댓글 내용 input쪽에
  const arr = {
    "comment" : inComment.value,
    "postId":postId,
  }
  fetch("http://localhost:3000/addComment",{
    method : "POST",
    headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(arr) // json  형식으로 
    })
.then((response) => {
// 응답을 JSON으로 파싱
return response.json();
})
.then((data) => {
  console.log(data);
})



};
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
      } else {
        separate.innerText = "댓글을 삭제하시겠습니까?";
        checkButton.addEventListener('click',(e)=> {
          deleteComment(i);
          window.location.href = `post-detail?id=${postId}`;
        });
        
      }
      modal.style.display = "block";
      document.body.style = "overflow : hidden";
    });
  }

}

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

fetch("../data.json")
  .then((response) => {
    // 응답을 JSON으로 파싱
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // 데이터 처리
    const commentInfo = data.comment_info; // 여기는 댓글 부분

    const postInfo = data.info; // 여기는 post 부분

    postInfo.forEach((item) => {
      if (postId == item.post_id) {
        // url에서 요청한 부분과 같은 글을 불러온다
        post(item); // 이렇게 하면 json 내에있는 것들이 들어간다
      } //이렇게하면 클릭한 페이지의 내용들을 슉슉 바꿔준다
    });
    commentInfo.forEach((item) => {
      if (postId == item.post_id) {
        writeComment(item);
      }
    }); // 여기까지가 페이지 동적으로 불러오는 일
 
const fix = document.getElementsByClassName("fix"); // 모든 수정버튼을 모아둔 fix array
const commentText = document.getElementById("intext"); // intext는 textarea를 의미
for (let i = 0; i < fix.length; i++) {
  // 각각의 수정버튼에 대해서 eventlistener를 달아준다
  fix[i].addEventListener("click", () => {
    if (i == 0) {
      // 첫 번째 수정 버튼이라면 게시물 수정으로 이동
      

      window.location.href = `post-fix?id=${postId}`; // 해당하는 page로 이동
    } else {
      const buttonText = document.querySelector(".button"); // 댓글 등록 버튼
      const fixText = document.getElementById("intext"); // 댓글 내용 input쪽에
      for (let j = 0; j < commentInfo.length; j++) {
        if (
          postId == commentInfo[j].post_id &&
          i == commentInfo[j].comment_number
        ) {
          // 여기서 i는 post id
          // 불러온 postId와 json 데이터 내에서의 postid가 같고, comment_number는 글 내에서의 댓글 순서
          fixText.innerText = ""; // 댓글 입력 창에 불러오기
          fixText.offsetHeight;
          buttonText.value = "댓글 수정"; // 버튼을 댓글 입력 -> 댓글 수정으로 바꾸고
          buttonText.offsetHeight; // 렌더링시켜서 결과물을 눈에 보이게 한다
          commentNumber = commentInfo[j].comment_number;
          

        }
      }

      // commentInfo.comment_detail
    } // innerText를 댓글 수정으로 바꾸고,
  });
} // 댓글 수정 부분 (조건 5번)

commentButton.addEventListener("click", function (event) {
  if (commentButton.value == "댓글 수정") {
    const nowText = document.getElementById("intext");
    const findComment = document.querySelectorAll(".commentDetail"); //댓글 내용들
    for (let i = 0; i < findComment.length; i++) {
      // 안에있는 내용
      if (i + 1 == commentNumber) {
        // 댓글 번호가 i+1과 같다면 ?
        // 이거로 수정할 댓글 찾고
        findComment[i].innerText = nowText.value;
        commentInfo.forEach((item) => {
          if (commentNumber == item.comment_number) {
            item.comment_detail = nowText.value;
          } // 지금 써져있는 텍스트를 Json 파일에서 변경한다
        });
        //댓글 내용을 textarea 내에있는 것으로 최신화 후
        findComment[i].offsetHeight; // 댓글 내용을 재렌더링시켜준다.
        fixComment(commentNumber,postId);
      }
    }
    commentButton.value = "댓글 등록";
  }
});
deleteEventListener();
registerButton.addEventListener('click',() =>{
  addComment(postId);

});
});
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
