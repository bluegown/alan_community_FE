

// 너도 끝 !!!! 잘가라 

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

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
const fileInput = document.getElementById('input-file');
fileInput.addEventListener('change', event => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
      console.log("Selected file:", selectedFile.name);
      console.log("File type:", selectedFile.type);
      console.log("File size:", selectedFile.size, "bytes");
      validProfileImageStatus = true; // 파일이 선택되면 유효성 상태 업데이트

      // 파일을 읽고 label에 배경 이미지로 설정
      const reader = new FileReader();
      reader.onload = function (e) {
          fileLabel.style.backgroundImage = `url(${e.target.result})`;
          fileLabel.classList.add('has-image')
      }
      reader.readAsDataURL(selectedFile);
  } else {
      console.log("No file selected.");
      validProfileImageStatus = false; // 파일이 선택되지 않으면 유효성 상태 업데이트
      fileLabel.classList.remove('has-image');
  }
  changeButtonColor(); // 버튼 색상 업데이트
});
const titleLengthCheck = (element)=>{

    if (element.length > 26){
        element = element.slice(0,26);
    }
    return element;
}

// 여기서는 3번은 기존 json을 불러와야하고,,
const fixButton = document.getElementById('join-form');

// 여긴 fetch를 통해 post_id 인식

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
    const info = data;
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
 
    const postTitle = document.getElementById('import-title');
    const postDetail = document.getElementById('intext');
    postTitle.innerText = info.title;
    postDetail.innerText = info.post_detail;

        
    });
  

  fixButton.addEventListener('submit',(e) =>{
    e.preventDefault();
    const f = document.getElementById('join-form');
    const formData = new FormData(f); 
    const data = Object.fromEntries(formData); // 이거로 바꾸니까 됐다 유후 ~  
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    const arr = {
      "title": data.title,
      "innerText" : data.innerText,
      "postId": postId
    }
    console.log(arr);

    

 // 여기에 내부 longtext innerText 변경 
   fetch("http://localhost:3000/info",{
    method : "POST",
    headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(arr), // json  형식으로 
      credentials:'include'
    })
.then((response) => {
  if(response.ok){
    return response.json();
  }
  else{
    alert("본인만이 글을 수정할 수 있습니다.");
    window.location.href = `post-detail?id=${postId}`; 
  }
// 응답을 JSON으로 파싱

})
.then((data) => {
 
  setTimeout(function () {
    window.location.href = `post-detail?id=${postId}`; // 일정 시간 후에 페이지 이동
    }, 2000); 


})

/* setTimeout(function () {
window.location.href = "post.html"; // 일정 시간 후에 페이지 이동
}, 2000); */

  

});
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