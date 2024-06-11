// 1번조건 : 포기(드롭다운 화나서 못하겠다)
// 2,3,4번 조건 구현 완료

const b = document.getElementById("fix-button"); // 수정하기 클릭시
const help = document.getElementById("helptext"); // helperText
const f = document.getElementById("finished-fix"); // 수정완료 버튼

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const innerEmail = document.getElementById("innerId");
fetch("http://localhost:3000/login/info",{
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
    const users = data.users;
    const user = users.find((user) => user.idnumber === postId);
    if (user) {
      innerEmail.innerText = user.userid;
    }

    const x = document.getElementById("nickname");
    x.addEventListener("blur", () => {
      const inputId = x.value;

      if (inputId.length == 0) {
        help.innerText = "*닉네임을 입력해주세요.";
        return false;
      }
      // 닉네임 중복은 json data forEach 돌면서 catch
      else if (inputId.length >= 11) {
        help.innerText = "*닉네임은 최대 10자 까지 작성 가능합니다.";
        return false;
      } // 닉네임 최대 10자까지 작성 가능
      else {
        const user = users.find((user) => user.nickname === inputId);
        if (user) {
          help.innerText = "";
        } // 만약 존재한다면 ? innerText를 공백으로 설정
      }
    });
  }); // fetch 여기서 끝내자

b.addEventListener("click", (e) => {
  e.preventDefault();
  const id = document.getElementById("nickname");
  if (id.value.length > 0 && id.value.length <= 10) {
    f.style.display = "block";
    f.offsetHeight;
    const arr = {
      idnumber: postId,
      nickname: id.value,
    };
    fetch("/fixNickname", {
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
  fetch('http://localhost:3000/logout', {
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
