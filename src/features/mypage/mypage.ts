import { api, tokenStore } from "../../types/apiClient";

// 로그인 안되어있으면 로그인 페이지로 이동
if (!tokenStore.getAccessToken()) {
  alert("로그인이 필요합니다!");
  location.href = "/features/login/login.html";
}

// 요소 연결
const profileImg = document.querySelector<HTMLImageElement>("#profileImage");
const fileInput = document.querySelector<HTMLInputElement>("#profileFile");
const nicknameInput = document.querySelector<HTMLInputElement>("#newNickname");
const updateBtn = document.querySelector<HTMLButtonElement>("#updateBtn");

// 🔹 로그인한 사용자 정보 불러오기
async function loadUserInfo() {
  try {
    const res = await api.get("/users/{_id}");
    const user = res.data.data ?? res.data.item;

    if (!user) {
      throw new Error("유저 정보를 찾을 수 없습니다.");
    }

    profileImg!.src = user.image ? `${user.image}` : "/assets/images/login-picture.png";
    nicknameInput!.value = user.name ?? "";
  } catch (err) {
    console.error(err);
    alert("유저 정보를 불러오지 못했습니다.");
  }
}

// 🔹 프로필 수정 요청
async function updateProfile() {
  const formData = new FormData();

  if (nicknameInput!.value) {
    formData.append("name", nicknameInput!.value.trim());
  }

  if (fileInput!.files?.[0]) {
    formData.append("image", fileInput.files[0]); // 선택한 경우만!
  }

  // 닉네임과 이미지 모두 없으면 수정할 내용이 없음
  if (!nicknameInput!.value.trim() && !fileInput!.files?.[0]) {
    alert("수정할 내용을 입력해주세요.");
    return;
  }

  try {
    // 인터셉터가 Content-Type과 Authorization 헤더를 자동으로 처리
    const res = await api.patch("/users/{_id}", formData);

    if (res.data.ok !== false) {
      alert("프로필이 수정되었습니다!");
      await loadUserInfo(); // UI 즉시 갱신!
      // 파일 입력 초기화
      fileInput!.value = "";
      
      // 헤더의 프로필 이미지 업데이트
      window.dispatchEvent(new Event('profileImageChanged'));
    } else {
      throw new Error(res.data.message || "프로필 수정 실패");
    }
  } catch (err) {
    console.error(err);
    const errorMessage = 
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message 
      || "프로필 수정 실패!";
    alert(errorMessage);
  }
}

// 🔹 이벤트 연결
updateBtn?.addEventListener("click", updateProfile);

// 🔹 최초 실행
loadUserInfo();
