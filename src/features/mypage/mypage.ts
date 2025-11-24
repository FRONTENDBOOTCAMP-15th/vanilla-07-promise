import { getAxios } from '../utils/axios';
import { getUserInform, getToken } from '../utils/checklogin';

interface UserItem {
  name?: string;
  path?: string;
}

interface UploadResult {
  ok: number;
  item: UserItem[]; // ← 배열로 변경!
}

// 로그인 안되어있으면 로그인 페이지로 이동

const user = getUserInform();

populateProfileSection();

//선택한파일 변수

function populateProfileSection() {
  const section = document.querySelector('.mypage') as HTMLElement;

  // 기존 요소 생성
  const profileImg = document.createElement('img');
  profileImg.id = 'profileImage';
  profileImg.src =
    user?.image && user.image !== ''
      ? user.image
      : '/assets/images/search/defaultProfil.webp';
  profileImg.alt = '프로필 이미지';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'profileFile';
  fileInput.accept = 'image/*';

  const myEmail = document.createElement('h3');
  myEmail.textContent = `email : ${user.email ?? ''}`;
  myEmail.id = 'myEmail';

  const myName = document.createElement('h3');
  myName.textContent = `name : ${user.name ?? ''}`;
  myName.id = 'myName';

  const nicknameInput = document.createElement('input');
  nicknameInput.type = 'text';
  nicknameInput.id = 'newNickname';
  nicknameInput.placeholder = '새 닉네임';

  const updateBtn = document.createElement('button');
  updateBtn.id = 'updateBtn';
  updateBtn.textContent = '정보 수정 완료';

  // 뒤로가기 버튼 추가
  const backBtn = document.createElement('button');
  backBtn.id = 'backBtn';
  backBtn.textContent = '← 뒤로가기';
  backBtn.addEventListener('click', () => {
    window.history.back();
  });

  const logoutBtn = document.createElement('button');
  logoutBtn.id = 'logout';
  logoutBtn.textContent = '로그아웃';
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');

    if (localStorage.getItem('accessToken')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    window.history.back();
  });

  // 버튼 클릭 이벤트
  updateBtn.addEventListener('click', () => {
    UpdateUserNameANdImage();
  });

  section.appendChild(profileImg);
  section.appendChild(fileInput);
  section.appendChild(myEmail);
  section.appendChild(myName);
  section.appendChild(nicknameInput);
  section.appendChild(updateBtn);
  section.appendChild(backBtn);
  section.appendChild(logoutBtn);

  let selectedFile: File | undefined;

  // 파일 선택 이벤트
  fileInput.addEventListener('change', event => {
    const target = event.target as HTMLInputElement;
    console.log(target.files);

    selectedFile = target.files?.[0];

    if (selectedFile) {
      // 여기서 undefined 체크
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          profileImg.src = reader.result as string; // 이미지 변경
        };
        reader.readAsDataURL(selectedFile);
      } else {
        alert('이미지 파일만 선택해주세요!');
        target.value = '';
      }
    }
  });

  async function UpdateUserNameANdImage(): Promise<void> {
    const formData = new FormData();

    if (selectedFile) {
      const uploadImageResult = await UpdatefileImage(selectedFile);

      if (uploadImageResult.item[0].path) {
        formData.append('image', uploadImageResult.item[0].path);
      }
    }

    if (nicknameInput.value.trim()) {
      formData.append('name', nicknameInput.value);
    }

    const axios = getAxios();

    console.log('formData', formData);
    const userObject = getUserInform();

    const userId = userObject._id;

    const body: { name?: string; image: string } = {
      image: formData.get('image')?.toString() ?? '',
    };

    // 닉네임 값이 있으면 추가
    const name = formData.get('name')?.toString();
    if (name) {
      body.name = name;
    }

    try {
      const result = await axios.patch(`/users/${userId}`, body, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (result.data.ok === 1) {
        const user = getUserInform() ?? {};

        if (body.name != null) {
          user.name = body.name;
        }

        if (body.image != null) {
          user.image = body.image;
        }

        const localUser = localStorage.getItem('user');
        if (localUser) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
          sessionStorage.setItem('user', JSON.stringify(user));
        }
        alert('상태가 변경되었습니다.');
        window.location.href = '/';
      } else {
        alert('오류가 발생했습니다.');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function UpdatefileImage(
    uploadFileObject: File,
  ): Promise<UploadResult> {
    const axios = getAxios();

    const formData = new FormData();
    formData.append('attach', uploadFileObject);

    try {
      const result = await axios.post(`/files/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
