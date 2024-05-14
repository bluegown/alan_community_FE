

// 너도 끝 !!!! 잘가라 




const titleLengthCheck = (element)=>{

    if (element.length > 26){
        element = element.slice(0,26);
    }
    return element;
}

// 여기서는 3번은 기존 json을 불러와야하고,,
const fixButton = document.getElementById('join-form');

// 여긴 fetch를 통해 post_id 인식

fetch("../data.json")
  .then((response) => {
    // 응답을 JSON으로 파싱
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // 데이터 처리
    const info = data.info; // 여기는 댓글 부분
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    info.forEach((item) => {
        if (item.post_id == postId){
            const postTitle = document.getElementById('import-title');
            const postDetail = document.getElementById('intext');
            postTitle.innerText = item.title;
            postDetail.innerText = item.innerText;

        }
    });
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
      "post_id": postId
    }
    console.log(arr);

    

 // 여기에 내부 longtext innerText 변경 
   fetch("http://localhost:3000/info",{
    method : "POST",
    headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(arr) // json  형식으로 
    })
.then((response) => {
// 응답을 JSON으로 파싱
return response.json();
})
.then((data) => {
 
  setTimeout(function () {
    window.location.href = `post-detail.html?id=${postId}`; // 일정 시간 후에 페이지 이동
    }, 2000); 


})

/* setTimeout(function () {
window.location.href = "post.html"; // 일정 시간 후에 페이지 이동
}, 2000); */

  

});
