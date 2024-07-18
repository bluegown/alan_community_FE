// 1번조건 구현 완료
// 2번조건 구현 완료
// 3번조건 구현 완료
// 4번조건 구현 완료
// 5번조건도 구현 완료(사실 좀빵꾸나긴했는데 되긴됨)
const checkButton = document.getElementById('post-delete');
const urlParams = new URLSearchParams(window.location.search);
const postId = parseInt(urlParams.get("id"));
let commentCount = 0
const findProfileById = async(userId) => {

  try {
    const response = await fetch(`http://localhost:3000/userId/${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error("로그인이 필요합니다.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
const  loadprofile = async() => {
  await fetch("http://localhost:3000/profileImage", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: 'include' 
  })
  .then(response => response.json()) // 응답을
  .then((data) => {
    const img = document.querySelector('.image');
    console.log(data.image);
    console.log(data);
    img.src = `http://localhost:3000/${data.image}`;

  })
};
loadprofile();
const lengthCheck = (element) => {
  if (element >= 100000) return "100K";
  if (element >= 10000) return "10K";
  if (element >= 1000) return "1K";
  return element;
};
// post detail은 끝!!!!!!!!!
const getCurrentUser = async () => {
  try {
    const response = await fetch("http://localhost:3000/current-user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error("로그인이 필요합니다.");
    }

    const data = await response.text();

    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const showButton = () => {
  fetch(`http://localhost:3000/posts/${postId}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: 'include' 
  })
  .then(response => response.json()) // 응답을
  .then(async (data) => {

    const currentUser = await getCurrentUser();
    if (data.user_id!== currentUser) {
      document.getElementsByClassName("fix")[0].style.display = 'none';
      document.getElementsByClassName("delete")[0].style.display = 'none';
    }

  })
}
showButton();
const post = async (elements) => {
  const fixTitle = document.querySelector(".post-title");
  const nickName = document.getElementById("nickName");
  const dates = document.getElementById("dates");
  const image = document.getElementById("fix-image");
  const inputText = document.getElementById("inputText");
  const profileImage = document.getElementById("profile-image");
  const views = document.getElementById("number");
  const comments = document.getElementById("number2");
  const deleteButton = document.getElementsByClassName("delete");
  let commentNumber = 0;
  fixTitle.innerText = elements.title;
  nickName.innerText = elements.nickname;
  dates.innerText = elements.dates;

  try {
    const img = await findProfileById(elements.user_id);
    if (img && img.image) {
      console.log(img.image);
      profileImage.src = `http://localhost:3000/${img.image}`;
    } else {
      console.error("사용자 이미지를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("Error loading profile image:", error);
  }
  image.src = `http://localhost:3000/${elements.post_image}`;
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

const fixComment = (commentNumber,innerText) => {

  const temp = {
    "commentNumber" : commentNumber,
    "comment_detail" : innerText,
    "postId":postId
  }
  fetch("http://localhost:3000/fixComment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(temp),
    credentials: 'include'
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
    postId: postId,
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
      commentCount = commentCount - 1
    });

} // 댓글 삭제

const writeComment = async (elements,currentUser) => {
  commentCount = commentCount + 1
  const entireInfo = document.createElement("div");
  const writerInfo = document.createElement("div");
  writerInfo.classList.add("writer-info"); // div writer-info
  const boxInfo = document.createElement("div");
  boxInfo.classList.add("box-info"); // div class= boxinofo
  const parent = document.querySelector("#parent"); // parent를 찾아준다 얜 냅둘거임

  const circle = document.createElement("img");
  circle.classList.add("circle");
  try {
    const user = await findProfileById(elements.userId); // await 키워드 사용
    if (user && user.image) {
      circle.src = `http://localhost:3000/${user.image}`;
    } 
  } catch (error) {
    console.error("Failed to load user profile image:", error);

  }

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
  if (elements.userId === currentUser) {
    const commentFix = document.createElement("button");
    commentFix.setAttribute("type", "button");
    commentFix.setAttribute("class", "fix");
    commentFix.innerText = "수정";
    commentFix.addEventListener("click", function (event) {
      event.preventDefault();
      const buttonText = document.querySelector(".button");
      const fixText = document.getElementById("intext");
      fixText.innerText = elements.comment_detail;
      fixText.offsetHeight;
      buttonText.value = "댓글 수정";
      buttonText.offsetHeight;

      if(buttonText.value === "댓글 수정"){
        buttonText.addEventListener('click', (e) => {
          fixComment(elements.commentNumber, fixText.value, elements.postId);
          window.location.href = `post-detail?id=${elements.postId}`;
        });
      }
    });

    const commentDelete = document.createElement("button");
    commentDelete.setAttribute("type", "button");
    commentDelete.setAttribute("class", "delete");
    commentDelete.innerText = "삭제";
    commentDelete.addEventListener("click", function (event) {
      event.preventDefault();
      let separate = document.getElementById("separate");

      separate.innerText = "댓글을 삭제하시겠습니까?";
      checkButton.addEventListener('click', (e) => {
        deleteComment(elements.commentNumber);
        window.location.href = `post-detail?id=${elements.postId}`;
      });
      modal.style.display = "block";
      document.body.style = "overflow : hidden";
    });

    buttons.appendChild(commentFix);
    buttons.appendChild(commentDelete);
  }
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
  commentCount = commentCount + 1
  const buttonText = document.querySelector(".button"); // 댓글 등록 버튼
  const inComment = document.getElementById("intext"); // 댓글 내용 input쪽에
  const arr = {
    "commentDetail" : inComment.value,
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
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // 응답 확인
      location.reload(); // 이거로 새로고침 
    })
    .catch((error) => console.error('Error:', error));
  }
  /* location.reload() */;
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
  .then(async (comments) => {

      const currentUser = await getCurrentUser();
    
      comments.forEach(comment => writeComment(comment, currentUser));
    }
  )

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
const dropdown = document.querySelector(".dropdown");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const imageClick = document.querySelector(".image");

  imageClick.addEventListener("click", function () {
    if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    }
});