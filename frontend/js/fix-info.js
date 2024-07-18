// 1번조건 : 포기(드롭다운 화나서 못하겠다)
// 2,3,4번 조건 구현 완료

const b = document.getElementById("fix-button"); // 수정하기 클릭시
const help = document.getElementById("helptext"); // helperText
const f = document.getElementById("finished-fix"); // 수정완료 버튼
const checkNickNameSplit = (element) => !element.includes(" ");
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const innerEmail = document.getElementById("innerId");
const validateEmail = (email) => Pattern.test(email); // 유효한 경우
const img2 = document.querySelector('.img2');
const duplicateNickName = (users,nickName) => !users.some(user => user.nickname === nickName);
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
    const img = document.querySelector('.img');
    console.log(data.image);
    console.log(data);
    img.src = `http://localhost:3000/${data.image}`;
    
    fileLabel.style.backgroundImage = `url(http://localhost:3000/${data.image})`;
  })
};
loadprofile();
const fileInput = document.getElementById('input-file');
const fileLabel = document.getElementById('fileupload-label');
fileInput.addEventListener('change', event => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
      console.log("Selected file:", selectedFile.name);
      console.log("File type:", selectedFile.type);
      console.log("File size:", selectedFile.size, "bytes");


      // 파일을 읽고 label에 배경 이미지로 설정
      const reader = new FileReader();
      reader.onload = function (e) {
          fileLabel.style.backgroundImage = `url(${e.target.result})`;
          fileLabel.classList.add('has-image')
      }
      reader.readAsDataURL(selectedFile);
  } else {
      console.log("No file selected.");

      fileLabel.classList.remove('has-image');
  }

});

fetch("http://localhost:3000/profileImage",{
  method : "GET",
  headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include' 
  })
  .then((response) => {
    // 응답을 JSON으로 파싱
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    
    innerEmail.innerText = data.userId;
    

// 만약 존재한다면 ? innerText를 공백으로 설정
  })
  
   // fetch 여기서 끝내자
   const x = document.getElementById("nickname");
   x.addEventListener("blur", () => {
     const nickNameValue = x.value;

     if (nickNameValue.length == 0) {
       help.innerText = "*닉네임을 입력해주세요.";
       return false;
     }
     // 닉네임 중복은 json data forEach 돌면서 catch
     else if (nickNameValue.length >= 11) {
       help.innerText = "*닉네임은 최대 10자 까지 작성 가능합니다.";
       return false;
     } // 닉네임 최대 10자까지 작성 가능
     else {
       fetch("http://localhost:3000/user/info", {
   method: "GET",
   headers: {
     "Content-Type": "application/json",
   },
   credentials: 'include' 
 })
 .then((response) => {
   // 응답을 JSON으로 파싱
   if (!response.ok) {
     throw new Error("Network response was not ok");
   }
   return response.json();
 }) 
 .then((data) => {
 if (!checkNickNameSplit(nickNameValue)) {
    help.innerText = "*띄어쓰기를 없애주세요.";
    f.style.backgroundColor = "#ACA0EB";
    f.offsetHeight;
   return false;
 } // false라면 공백이 있다는 뜻
 // 이자리에 fetch 넣고 duplicated 조건 넣을 것
  else if(!duplicateNickName(data,nickNameValue)){
   help.innerText = "*중복된 닉네임입니다.";
   f.style.backgroundColor = "#ACA0EB";
   f.offsetHeight;
   return false;
 }
 else{
    help.innerText = "";

      f.style.backgroundColor = "#7F6AEE";

      
    }
    f.offsetHeight;
  
 })
}
   })
 




b.addEventListener("click", (e) => {
  e.preventDefault();
  const id = document.getElementById("nickname");
  if (id.value.length > 0 && id.value.length <= 10) {
    f.style.display = "block";
    f.offsetHeight;
    const f = document.querySelector('.join-form'); // 이거로 form 가져오고 
      // // 이거로 바꾸니까 됐다 유후 ~ 
      const formData = new FormData(f);
    fetch("http://localhost:3000/fixNickname", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
      credentials : 'include' // json  형식으로
    })
      .then((response) => {
        // 응답을 JSON으로 파싱
        return response.json();
      })
      .then((data) => {
        console.log("서버 응답:", data);
      });
    setTimeout(function () {
      f.style.display = "none"; // 일정 시간 후에 페이지 이동
    }, 2000); // 3초(3000밀리초) 후에 실행
  }
});

const q = document.getElementById("quit-button"); // quit-button (회원탈퇴)
const modal = document.getElementById("modal"); // 모달 버튼 load

q.addEventListener("click", function (event) {
  let separate = document.getElementById("separate");
  separate.innerText = "회원탈퇴 하시겠습니까?";
  modal.style.display = "block";
  document.body.style = "overflow : hidden";
});

const cancelButton = document.getElementById("cancel");

cancelButton.addEventListener("click", function (event) {
  modal.style.display = "none";
  document.body.style = "overflow : auto";
});

const quit = document.getElementById("post-delete"); // 회원탈퇴 - 확인 버튼

quit.addEventListener("click", () => {
  // json data delete
  fetch('http://localhost:3000/removeUser', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include' // 쿠키를 포함하여 요청을 보냅니다.
})
.then(response => {
  if (!response.ok) {
    throw new Error('Logout Failed!');
  }
  return response.text();

})
.then(data => {
  console.log(data);
  // 로그아웃이 성공한 후 클라이언트에서 할 작업
  // 예를 들어, 로그인 페이지로 리디렉션
})
.catch(error => {
    alert(error.message); // 오류 메시지를 표시합니다.
});

  window.location.href = "/login";
});

// 확인 누르면 데이터 삭제하기 구현

//5번 조건 : 모달까지는 완료 , json 연동해서 data delete ->
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