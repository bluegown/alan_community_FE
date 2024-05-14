// 1번조건 구현 완료
// 2번조건도 완료
// 3번도 구현 완료!!

function lengthid(value) {
  if (value.length >= 4) {
    return true;
  } else {
    return false;
  }
}

function validateEmail(email) {
  const Pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return Pattern.test(email);
} 
const joinButton = document.getElementById('join'); 
joinButton.addEventListener('click',() =>{
  window.location.href = "join";
});
function checkPassword(password) {
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
}

function checkInformation(users,userid,password){
  for (let i = 0; i< element.length; i++){
    if (userid == users[i].userid && password == users[i].password)
    return true;
  }
  return false;
}

function checkLogin(users,userid,password){
  for (let i = 0; i<users.length; i++){
  if(userid == users[i].userid){
    if (password == users[i].password){
      return true; // id, pw 모두 일치하는 경우
    }
    else{
      return false;
    } // 아이디는 안에 존재하지만 비밀번호는 없는 경우
  }

  }
  
}
// ../면 /Users/sunghyun/Desktop/인데..
// ./는 현재 디렉토리 ../는 상위 디렉토리
fetch("../data.json")
  .then((response) => {
    // 응답을 JSON으로 파싱
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }) 
  .then((data) => {
    const users = data.users;
    const button = document.querySelector('.helpertext');

    const t = document.getElementById("real"); // form 태그의 id
    t.addEventListener("submit", function (event) {
      event.preventDefault(); // 이걸 통해 디폴트로 일어나는 것들을 방지하고

      var userid = document.getElementById("userid").value; // 입력시에 유저아이디
      var password = document.getElementById("password").value; // 입력시에 비밀번호
      if (userid == "") {
        button.innerText = '이메일을 입력해주세요.'
        return false;
      } else if (lengthid(userid) == false) {
        button.innerText ="입력하신 이메일이 너무 짧습니다."; // 너무 짧은 경우
        return false;
      } else if (!validateEmail(userid)) {
        button.innerText ="유효하지 않은 이메일 주소입니다.";
        return false;
      } else if (password == "") {
        button.innerText ="비밀번호를 입력해주세요";
        return false;
      } else if (!checkPassword(password)) {
        button.innerText =
          "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        return false;
      } else if (!checkLogin(users,userid,password)) {
        button.innerText ="비밀번호가 다릅니다."; // 바보냐 json에서 배열로 선언해두고 인덱스를 안하니 당연히 이상한값이 들어가지
        // false로 반환되었다면 아이디는 리스트 안에 있지만 비밀번호가 다른 경우 
        return false;
      } // 만약 둘이 일치하지 않는다면
      else {
        button.innerText =""; 
        var element = document.getElementById("submit2");
        element.style.backgroundColor = "#7F6AEE";
        element.offsetHeight; // 재렌더링을 발생시키고

        setTimeout(function () {
          window.location.href = "post"; // 일정 시간 후에 페이지 이동
        }, 3000); // 3초(3000밀리초) 후에 실행
      } // 이유는 js는 동기적으로 실행이 되기 떄문에....
    });
  })
  
