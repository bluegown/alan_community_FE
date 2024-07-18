// 1번조건 끝
// 2번조건 끝
// 3번조건 끝
// 4번조건 끝



let title = document.getElementById('title'); // 제목 textarea input
let intext = document.getElementById('intext') // 본문 textarea input
const joinButton = document.getElementById('join-button'); // 수정하기 button
const helperText = document.getElementById('help'); // *helper text 
const image = document.querySelector('#input-file'); // image 첨부 파일
let titleCheck = false;
let intextCheck = false; // 디폴트값을 false로 설정
const lengthCheck = (element) => !(element =="")
document.getElementById('input-file').addEventListener('change', function() {
    var fileName = this.files[0].name;
    document.getElementById('ment').textContent = fileName;
});
title.addEventListener('input',() =>{
    title = document.getElementById('title');  // 제목 버튼
    titleCheck = lengthCheck(title.value);
    intext = document.getElementById('intext');
    intextCheck = lengthCheck(intext.value);
    if(titleCheck == true && intextCheck == true){
        joinButton.style.backgroundColor = "#7F6AEE"; 
    } // 둘다 채워지는 경우 !! 변경
    else{
        joinButton.style.backgroundColor = "#ACA0EB";
    }
    
    
});

intext.addEventListener('input',() =>{
    title = document.getElementById('title');  // 제목 버튼
    titleCheck = lengthCheck(title.value);
    intext = document.getElementById('intext');
    intextCheck = lengthCheck(intext.value);
    if(titleCheck == true && intextCheck == true){
        joinButton.style.backgroundColor = "#7F6AEE"; 
    } // 둘다 채워지는 경우 !! 변경
    else{
        joinButton.style.backgroundColor = "#ACA0EB";
        
    }
   
    
   
});
let flag = 1;
image.addEventListener('change',(event) =>{
    const target = event.target;
    const files = target.files;
    const file = files[0];
    flag = 0; // 발생했으면 0 아니면 1
});

const fbutton =  document.querySelector('.join-form'); // form가지고온다
fbutton.addEventListener('submit',function(event){
    event.preventDefault();
    
    if(titleCheck == false || intextCheck == false){
        helperText.innerText = "*제목, 내용을 모두 작성해주세요.";
    }
    else{
        helperText.innerText = "";
        
        const f =  document.querySelector('.join-form'); // form 가지고온다
        const formData = new FormData(f); 
        const data = Object.fromEntries(formData); // 이거로 바꾸니까 됐다 유후 ~        
        
        for (const pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
          }
        
    
    
    
        fetch("http://localhost:3000/submit",{
            method : "POST",
            body: formData,
            credentials : 'include' // json  형식으로 
            })
  .then((response) => {
    // 응답을 JSON으로 파싱
    if(response.ok){
    return response.json();
    }// 정상상태
    else{
    alert("로그인을 해야 합니다.");
    window.location.href = "/";
    }
   
    
  })
  .then((data) => {
    console.log('서버 응답:', data);
    window.location.href = "/post";
    })
}

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


