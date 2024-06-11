// 1번조건 구현 완료
// 2번조건도 완료
// 3번도 구현 완료!!

const lengthid = (value) => (value.length >=4);
const Pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => Pattern.test(email); // 유효한 경우

const joinButton = document.getElementById('join'); 
joinButton.addEventListener('click',() =>{
  window.location.href = "join";
});
const checkPassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
    password,
  );
  return password.length >= 8 && password.length <= 20 &&
         hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

const checkInformation = (users,userid,password) => users.some(users => users.userid == userid && password == users.password);


const checkLogin = (users,userid,password) => {
  
  return users.some(users => users.password == password);
  
};
// ../면 /Users/sunghyun/Desktop/인데..
// ./는 현재 디렉토리 ../는 상위 디렉토리
fetch("http://localhost:3000/user/info",{
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
    const users = data.users;
    const button = document.querySelector('.helpertext');

    const t = document.getElementById("real"); // form 태그의 id
    t.addEventListener("submit", async function (event) {
      event.preventDefault(); // 이걸 통해 디폴트로 일어나는 것들을 방지하고

      let userid = document.getElementById("userid").value; // 입력시에 유저아이디
      let password = document.getElementById("password").value; // 입력시에 비밀번호
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
        return false
      }else{
        const arr = {
          "userId" : userid,
          "password": password
        };
        fetch("http://localhost:3000/login",{
         method : "POST",
         headers: {
        'Content-Type': 'application/json'
         },
      body: JSON.stringify(arr),
      credentials: 'include' // 세션 쿠키를 포함하여 요청하는 코드
    })
    .then((response) => { // 만약 post한게 ok가 났다면 => 로그인 성공을 의미한다
      if(response.ok){
      console.log("Login Success!");
      setTimeout(function () {
        window.location.href = "post"; // 일정 시간 후에 페이지 이동
      }, 2000); // 3초(3000밀리초) 후에 실행    // Redirect to protected page
    }
    else{
    alert("로그인 실패!");
    window.location.href = "/";
    }
    })

    } 
      /*else if (!checkLogin(users,userid,password)) {
        button.innerText ="비밀번호가 다릅니다."; // 바보냐 json에서 배열로 선언해두고 인덱스를 안하니 당연히 이상한값이 들어가지
        // false로 반환되었다면  아이디는 리스트 안에 있지만 비밀번호가 다른 경우 
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
      } // 이유는 js는 동기적으로 실행이 되기 떄문에.... */
    });
  })
  
