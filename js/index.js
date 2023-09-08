// 시 바뀌면 구군 업데이트

document.querySelector("#sido").addEventListener("change", function () {
    if (this[this.selectedIndex].value) {
        let regcode = this[this.selectedIndex].value;
        getGugunCode(regcode);
    } else {
      initOption("gugun");
    }
});
  
function getGugunCode(regcode) {
    fetch(`https://apis.data.go.kr/B551011/KorService1/areaCode1?MobileOS=WIN&areaCode=${regcode}&MobileApp=tripple&_type=json&serviceKey=%2FFy%2BV4EMfuOv2o32OR8LJkNz2sN97Zp88WqDmL%2FFoSnMQ89hXzo%2B9nAbDAznshQuBxw7py4Ce72AIk63t1AsEg%3D%3D`)
    .then((res) => res.json())
    .then((data) => addOption(data.response.body.items.item))
}

  function addOption(data) {
      let opt = ``;
    opt += `<option value="0">구 선택</option>`;
    for (let i = 0; i < data.length; i++) {
        opt += `
        <option value="${data[i].code}">${data[i].name}</option>
        `;
      }
      
      document.querySelector(`#gugun`).innerHTML = opt;
}

// 회원 가입 시 지역 선택
document.querySelector("#signup-sido").addEventListener("change", function () {
    if (this[this.selectedIndex].value) {
        let regcode = this[this.selectedIndex].value;
        getGugunCode(regcode);
    } else {
      initOption("signup-gugun");
    }
});
  
function getGugunCode(regcode) {
    fetch(`https://apis.data.go.kr/B551011/KorService1/areaCode1?MobileOS=WIN&areaCode=${regcode}&MobileApp=tripple&_type=json&serviceKey=%2FFy%2BV4EMfuOv2o32OR8LJkNz2sN97Zp88WqDmL%2FFoSnMQ89hXzo%2B9nAbDAznshQuBxw7py4Ce72AIk63t1AsEg%3D%3D`)
    .then((res) => res.json())
    .then((data) => addOption(data.response.body.items.item))
}

  function addOption(data) {
      let opt = ``;
    opt += `<option value="0">구 선택</option>`;
    for (let i = 0; i < data.length; i++) {
        opt += `
        <option value="${data[i].code}">${data[i].name}</option>
        `;
      }
      
      document.querySelector(`#signup-gugun`).innerHTML = opt;
}
  



// 지도 생성
window.onload = function () {
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    }; 

    new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
}

document.querySelector('#type').addEventListener("change", function () {
    map = setMap();
    if (this[this.selectedIndex].value) {
        let areaCode = document.querySelector('#sido').value;
        let sigunguCode = document.querySelector('#gugun').value;
        let contentTypeId = document.querySelector('#type').value;;
        fetch(`https://apis.data.go.kr/B551011/KorService1/areaBasedList1?&MobileOS=WIN&MobileApp=tripple&_type=json&listYN=Y&arrange=A&areaCode=${areaCode}&sigunguCode=${sigunguCode}&serviceKey=%2FFy%2BV4EMfuOv2o32OR8LJkNz2sN97Zp88WqDmL%2FFoSnMQ89hXzo%2B9nAbDAznshQuBxw7py4Ce72AIk63t1AsEg%3D%3D&contentTypeId=${contentTypeId}`, { method: "GET" })
        .then((res) => res.json())
            .then((data) => {
                makeList(map, data.response.body.items.item);
                // setMap();
            })
    }
})


function setMap() {
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    }; 

    return new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    // displayMarker(map);
}

function makeList(map, trips) {
    var positions; // marker 배열.
    document.querySelector("table").setAttribute("style", "display: ;");
    let tripList = ``;
    positions = [];
    trips.forEach((area) => {
        tripList += `
        <tr onclick="moveCenter(${area.mapy}, ${area.mapx});">
            <td><img src="${area.firstimage}" width="100px"></td>
            <td>${area.title}</td>
            <td>${area.addr1} ${area.addr2}</td>
            <td>${area.mapy}</td>
            <td>${area.mapx}</td>
        </tr>
        `;

        let markerInfo = {
        title: area.title,
        latlng: new kakao.maps.LatLng(area.mapy, area.mapx),
        };
        positions.push(markerInfo);
    });
    document.getElementById("trip-list").innerHTML = tripList;
    displayMarker(map, positions);
}


function displayMarker(map, positions) {
    // 마커 이미지의 이미지 주소입니다
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (var i = 0; i < positions.length; i++) {
    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new kakao.maps.Size(24, 35);

    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: positions[i].latlng, // 마커를 표시할 위치
        title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
    });
    }

    // 첫번째 검색 정보를 이용하여 지도 중심을 이동 시킵니다
    map.setCenter(positions[0].latlng);
}

function moveCenter(lat, lng) {
    map.setCenter(new kakao.maps.LatLng(lat, lng));
}
  


// 로그인
document.querySelector("#btn-signIn").addEventListener("click", function () {
    let id = document.querySelector("#userId").value;
    if (!id) {
        alert("아이디1를 입력해주세요. ");
        return;
    }
    let password = document.querySelector("#userPassword").value;
    if (!password) {
        alert("비밀번호를 입력해주세요. ");
        return;
    }

    let userStorage = localStorage.getItem(id);
    if (userStorage) {
        var userData = JSON.parse(userStorage);
        var userId = userData.id;
        var userPW = userData.password;
        if ((id == userId) && (password == userPW)) {
            alert("로그인에 성공하였습니다. ");
            document.cookie = "userId=" + userId + ";";
            return;
        } else {
            alert("아이디나 비밀번호가 틀립니다. ");
            return;
        }
    } else {
        alert("없는 사용자입니다. ");
        return;
    }
});


// 회원가입
// document.querySelector(".signup-sido").addEventListener("click", function () {

// };


document.querySelector("#btn-signUp").addEventListener("click", function () {
    let name = document.querySelector("#name").value;
    if (!name) {
        alert("이름을 입력해주세요.");
        return;
    }

    let id = document.querySelector("#id").value;
    if (!id) {
        alert("아이디를 입력해주세요.");
        return;
    }

    let password = document.querySelector("#password").value;
    if (!password) {
        alert("비밀번호를 입력해주세요.");
        return;
    }

    let confirmPassword = document.querySelector("#confirmPassword").value;
    if (!confirmPassword) {
        alert("비밀번호를 한번 더 입력해주세요.");
        return;
    }
    if (!(password === confirmPassword)) {
        alert("비밀번호를 다시 확인해주세요.");
        return;
    }

    let email = document.querySelector("#email").value;
    if (!email) {
        alert("이메일을 입력해주세요.");
        return;
    }

    var tgSido = document.getElementById("sido");
    var tgGugun = document.getElementById("gugun");

    var sido = tgSido.options[tgSido.selectedIndex].text;
    var gugun = tgGugun.options[tgGugun.selectedIndex].text;

    let area = sido + " " + gugun;
    if (!area) {
        alert("지역을 선택해주세요.");
        return;
    }


    let user = {
        name,
        id,
        password,
        email,
        area
    };

    localStorage.setItem(id, JSON.stringify(user));
    alert("회원 가입이 완료되었습니다.");
    location.reload();
    document.querySelector("#pollModal").modal("hide");
});


// 유저 정보 조회
// document.querySelector("#btn-userdata").addEventListener("click", function () {
//     var txt = "";
//     var ans = "";
//     if (document.cookie != "") {
//         txt = document.cookie.split(";"); // ';'를 기준으로 split
//         for (i in txt) // txt에 있는 쿠키들을 조사
//         {
//             // name과 value 모두 있는 쿠키만 ans에 넣어준다.
//             if (txt[i][txt[i].length - 1] != "=") {
//                 ans += txt[i];
//             }
//         }
//     }
//     // 쿠키가 존재하지 않았을 경우
//     let opt = ``;
//     if (ans == "")
//         alert("쿠키가 없습니다.");
//     // 쿠키가 존재할 경우 alert(ans); 
//     else {
//         var userStorage = localStorage.getItem(ans.split("=")[1]);
//         var userData = JSON.parse(userStorage);
//         opt += `
//         <p>${userData.id}</p>
//         <p>${userData.password}</p>
//         <p>${userData.name}</p>
//         <p>${userData.email}</p>
//         <p>${userData.area}</p>
//         `;
//         document.querySelector("#userDataList").innerHTML = opt;
//     }
// });