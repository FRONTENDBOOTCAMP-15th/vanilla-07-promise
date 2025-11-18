import axios from 'axios';
import { AxiosError } from 'axios';
import { getAxios } from '../utils/axios';
import type { DetailRes, LoginUser } from '../utils/types';

// axios 인스턴스
const axiosInstance = getAxios();  

let nicknameVerified = false;
let emailVerified = false;

//html 요소
const nickname = document.querySelector('#nickname-input') as HTMLInputElement;
const email = document.querySelector('#email-input') as HTMLInputElement;
const password = document.querySelector('#password-input') as HTMLInputElement;
const passwordCheck = document.querySelector('#password-confirm-input') as HTMLInputElement;
const signupForm = document.querySelector('#signup-form') as HTMLFormElement;

const nicknameCheckBtn = document.querySelector('.field-action-nickname') as HTMLButtonElement;
const emailCheckBtn = document.querySelector('#field-action-email') as HTMLButtonElement;

const iconEyeBtn1 = document.querySelector('.field-icon-button1') as HTMLButtonElement;
const iconEyeBtn2 = document.querySelector('.field-icon-button2') as HTMLButtonElement;

const nicknameMessage = document.querySelector('#nickname-message') as HTMLParagraphElement;
const emailMessage = document.querySelector('#email-message') as HTMLParagraphElement;
const passwordMessage = document.querySelector('#password-message') as HTMLParagraphElement;
const passwordConfirmMessage = document.querySelector('#password-confirm-message') as HTMLParagraphElement;

// =========================
// ⭐ 별명 중복 확인
// =========================
nicknameCheckBtn.addEventListener('click', checkNickname);

async function checkNickname() {
  const nicknameValue = nickname.value.trim();

  if (!nicknameValue) {
    nicknameMessage.textContent = '별명을 입력해주세요';
    nicknameVerified = false;
    return;
  }

  try {
    const { data } = await axiosInstance.get<DetailRes<LoginUser>>('/users/name', {
      params: { name: nicknameValue },
    });

    if (data.ok === 1) {
      nicknameMessage.textContent = '사용 가능한 별명입니다.';
      nicknameVerified = true;
      return;
    }

    nicknameVerified = false;
    nicknameMessage.textContent = '이미 사용 중인 별명입니다.';

  } catch (err) {
    if (axios.isAxiosError(err)) {
      nicknameMessage.textContent = err.response?.data?.message || '서버 오류입니다.';
      nicknameVerified = false;
    }
  }
}

// =========================
// ⭐ 이메일 중복 확인
// =========================
emailCheckBtn.addEventListener('click', checkEmail);

async function checkEmail() {
  const emailValue = email.value.trim();

  if (!emailValue) {
    emailMessage.textContent = '이메일을 입력해주세요.';
    emailVerified = false;
    return;
  }

  if (!emailValue.includes('@')) {
    emailMessage.textContent = '올바른 이메일 형식이 아닙니다.';
    emailVerified = false;
    return;
  }

  try {
    const { data } = await axiosInstance.get<DetailRes<LoginUser>>('/users/email', {
      params: { email: emailValue },
    });

    if (data.ok === 1) {
      emailVerified = true;
      emailMessage.textContent = '사용 가능한 이메일입니다.';
      return;
    }

    emailVerified = false;
    emailMessage.textContent = '이미 등록된 이메일입니다. 다른 이메일을 입력해주세요.';

  } catch (err) {
    if (axios.isAxiosError(err)) {
      emailVerified = false;
      emailMessage.textContent = err.response?.data?.message || '서버 오류입니다.';
    }
  }
}

// =========================
// ⭐ 비밀번호 숨김/보기
// =========================
iconEyeBtn1.addEventListener('click', () => {
  const isHidden = password.type === 'password';

  if (isHidden) {
    password.type = 'text';
  } else {
    password.type = 'password';
  }
});

iconEyeBtn2.addEventListener('click', () => {
  const isHidden = passwordCheck.type === 'password';

  if (isHidden) {
    passwordCheck.type = 'text';
  } else {
    passwordCheck.type = 'password';
  }
});

// =========================
// ⭐ 비밀번호 일치 검사
// =========================
function passwordCheckLive() {
  const pwd1 = password.value;
  const pwd2 = passwordCheck.value;

  if (pwd1 && (pwd1.length < 8 || pwd1.length > 16)) {
    passwordConfirmMessage.textContent = '비밀번호는 8~16자여야 합니다.';
    passwordConfirmMessage.style.color = 'var(--color-error)';
    return;
  }

  if (pwd1 === pwd2) {
    passwordConfirmMessage.textContent = '비밀번호가 일치합니다.';
    passwordConfirmMessage.style.color = 'var(--color-primary)';
  } else {
    passwordConfirmMessage.textContent = '비밀번호가 일치하지 않습니다.';
    passwordConfirmMessage.style.color = 'var(--color-error)';
  }
}

// 비밀번호 입력 시 바로 검사
password.addEventListener('input', passwordCheckLive);
passwordCheck.addEventListener('input', passwordCheckLive);

// =========================
// ⭐ 회원가입
// =========================
signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const cleanNickname = nickname.value.replace(/\s/g, '');
  const cleanEmail = email.value.replace(/\s/g, '');

  if (!nicknameVerified) {
    alert('별명 중복 확인을 해주세요.');
    return;
  }

  if (!emailVerified) {
    alert('이메일 중복 확인을 해주세요.');
    return;
  }

  if (password.value !== passwordCheck.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  const signup = {
    email: cleanEmail,
    name: cleanNickname,
    password: password.value,
    type: 'user',
  };

  try {
    await axiosInstance.post<DetailRes<LoginUser>>('/users', signup);
    alert('회원가입에 성공했습니다. 로그인 페이지로 이동합니다.');
    location.href = './login.html';
  } catch (err) {
    alert(`회원가입 실패: ${err}`);
  }
});
