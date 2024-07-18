// 1번조건 구현 완료
// 2번조건 구현 완료
// 3번 보류(구현X) 

const titleLengthCheck = (element)=>{
  if (element.length > 26){
      element = element.slice(0,26);

  }
  return element;
};
const findProfileById = async(postId) => {

  try {
    const response = await fetch(`http://localhost:3000/profileImage`, {
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
const p = document.getElementById("write-post");
const lengthCheck = (element) => {
  if (element >= 100000) return "100K";
  if (element >= 10000) return "10K";
  if (element >= 1000) return "1K";
  return element;
};
p.addEventListener("click", () => {
  window.location.href = "write-post";
}); // 게시물 작성 클릭 -> 이동 부분
function loadprofile(){
  fetch("http://localhost:3000/profileImage", {
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
fetch("http://localhost:3000/allposts", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: 'include' 
  })
  .then(response => response.json()) // 응답을
  .then((data) => {
    const info = data.info; // 길이가 4인 배열 형캐로
    ////////////////////////////////////////
    // JSON 데이터의 각 객체마다 박스를 추가

 
     data.forEach(async (item) => {
      // 여기까지는 잘 들어옴
      const box01 = document.createElement('div');
      box01.classList.add('box01');
       document.body.appendChild(box01);// 먼저 가장 뼈대가 될 box01을 넣어주고
       // 앗 이걸 까먹었네 ~

      box01.classList.add("box01"); // 클래스명도 box01로 동일했으므로 넣어준다
      const title_length = document.createElement("p"); // box01의 자식인 p태그 title-length를 만들어주고 자식으로 넣는다
      box01.appendChild(title_length);
      title_length.classList.add("title-length");

      title_length.textContent = titleLengthCheck(item.title); // 그에 맞는 title을 innerText로 넣어준다

      // js에서 동적으로 요소들을 불러올 때, html에서 온전히 추가했던 &nbsp;나 <br>태그들을 어떻게 추가해야 하는지?

      const boxinfo = document.createElement("div");
      boxinfo.classList.add("box-info");
      const dates = document.createElement("div");
      const likes = item.like_count;
      const comments = item.comment_count;
      const views = item.view_count;
      box01.appendChild(boxinfo);

      const like = lengthCheck(likes);
      const comment = lengthCheck(comments);
      const view = lengthCheck(views); // 실제 값들을 넘겨주고 어떻게 표기할건지에 대하여
      lengthCheck(views);
      boxinfo.textContent = `좋아요 ${like} 댓글 ${comment} 조회수 ${view} `;
      boxinfo.appendChild(dates);
      dates.innerText = item.dates;

      const horizontal_line2 = document.createElement("div");
      horizontal_line2.classList.add("horizontal-line");
      box01.appendChild(horizontal_line2); // line 설정

      const writer_info = document.createElement("div");
      writer_info.classList.add("writer-info");
      box01.appendChild(writer_info);

      const profileImage = document.createElement("img");
      const nickName = document.createElement("div");
      writer_info.appendChild(profileImage);
      writer_info.appendChild(nickName); // writer-info 내에 profile-image, nickname 존재
      profileImage.classList.add("profile-image");
      console.log(item);
      try {
        const posts = await findProfileById(item.user_id); // await 키워드 사용
        console.log(posts);
        if (posts && posts.image) {
          profileImage.src = `http://localhost:3000/${posts.image}`;
        } 
      } catch (error) {
        console.error("Failed to load user profile image:", error);
    
      } 
      nickName.innerText = item.nickname;
      nickName.style.marginLeft = "10px";
      nickName.style.fontWeight = "bold";

     

      box01.addEventListener("click", () => {      // URL로 이동
          window.location.href = `post-detail?id=${item.postId}`; // 이렇게 하면 된다!!
  // 여기서 이제 postid 받아와서 -> post-detail/{post_id};로 이동시킨다.
      });
    });

  })
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
// fetch로 json 데이터를 다 불러오고 난 뒤에 클릭을 하는 경우니까 아래에다가 해줘도 되겠지?

// 아직 DB랑 연동을 못해서 좋아요 댓글 조회수 업그레이드 기능을 못넣었다 ...
  // 여기서 이제 postid 받아와서 -> post-detail/{post_id};로 이동시킨다. 이거 뺴고 끝 !! 