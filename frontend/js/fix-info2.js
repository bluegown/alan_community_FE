// 구현 완료


const checkPassword =(password) => {

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      password,
    );
    if (password.length < 8 || password.length > 20) {
      return false;
    }
    if (!(hasUpperCase && hasLowerCase && hasNumber)) {
      return false;
    } // 셋중 하나라도 만족 못하면 return false
    if (!hasSpecialChar) {
      return false;
    } // 특수문자 없는 경우
  
    return true;


  };
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const password = document.getElementById('password');
  const password2 = document.getElementById('password2');
  const helperText = document.getElementById('helpertext');
  const helperText2 = document.getElementById('helpertext2');
  const fixButton = document.getElementById('finish-fix');
  const f = document.getElementById('finished-fix'); // 수정완료 버튼
  let pwcheck = false;
  let pwcheck2 = false;
  password.addEventListener('blur',() =>{
    
    if(checkPassword(password)){
        helperText.innerText = "*비밀번호는 8자 이상,20자 이하이며, 대문자,소문자,숫자,특수문자를 각각 최소 1개 포함해야 합니다.";
    }
    else if(password.length == 0){
        helperText.innerText = "*비밀번호를 입력해주세요."
    }
    else{
        helperText.innerText = "";
        pwcheck = true;
    }
    if(pwcheck && pwcheck2){
        fixButton.style.backgroundColor="#7F6AEE";
    }
    else{
        fixButton.style.backgroundColor="#ACA0EB";
    }
    fixButton.offsetHeight;

  });
  password2.addEventListener('blur',() =>{
    const pwCheck = document.getElementById('password2');
   
    if(password2.length == 0){
        helperText2.innerText = "*비밀번호를 한번 더 입력해주세요."
    }
    else if(pwCheck!= password2){
        helperText2.innerText = "*비밀번호가 다릅니다."
    }
    else{
        helperText2.innerText = "";
        pwcheck2 = true;
    }

    if(pwcheck && pwcheck2){
        fixButton.style.backgroundColor="#7F6AEE";
    }
    else{
        fixButton.style.backgroundColor="#ACA0EB";
    }
    fixButton.offsetHeight;

  });

  
  fixButton.addEventListener('click',function(event){
    event.preventDefault();
    const inputPw = document.getElementById('password').value;
    if(pwcheck && pwcheck2){
        f.style.display = "block";
        f.offsetHeight;
        const arr = {
          "password":inputPw,
          "idnumber":postId
        }
        fetch("http://localhost:3000/fixPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(arr), // json  형식으로
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

