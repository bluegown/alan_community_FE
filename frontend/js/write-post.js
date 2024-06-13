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
        console.log(data);
        var fileInput = document.getElementById('input-file');
        var file = fileInput.files[0]; // 피그마 조건에서 파일은 1개....
        const arr = {
            "title": data.title,
            "innerText": data.intext,
            "img": data.file
        }
        console.log(arr);
    
    
    
        fetch("http://localhost:3000/submit",{
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(arr),
              credentials : 'include' // json  형식으로 
            })
  .then((response) => {
    // 응답을 JSON으로 파싱
    if(response.ok){
    return response.json();
    }// 정상상태
    else{
    alert("로그인을 해야 합니다!");
    window.location.href = "/";
    }
    
  })
  .then((data) => {
    console.log('서버 응답:', data);
    })

    /* setTimeout(function () {
        window.location.href = "post.html"; // 일정 시간 후에 페이지 이동
      }, 2000); */
      setTimeout(function () {
        window.location.href = "post"; // 일정 시간 후에 페이지 이동
      }, 1000); 
    }
});
    



