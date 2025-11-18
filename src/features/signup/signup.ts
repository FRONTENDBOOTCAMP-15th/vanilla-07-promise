import axios from 'axios';
import { getAxios } from '../utils/axios';
import type { DetailRes, LoginUser } from '../utils/types.ts';

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
const passwordConfirmMessage = document.querySelector('#password-confirm-message') as HTMLParagraphElement;

// 필드 요소 가져오기
const nicknameField = document.querySelector('[data-field="nickname"]') as HTMLElement;
const emailField = document.querySelector('[data-field="email"]') as HTMLElement;
const passwordConfirmField = document.querySelector('[data-field="password-confirm"]') as HTMLElement;

// =========================
// ⭐ 필드 상태 업데이트 헬퍼 함수
// =========================
function updateFieldState(
  field: HTMLElement | null,
  message: HTMLElement | null,
  state: 'success' | 'error' | 'info' | 'clear',
  text: string = ''
) {
  if (!field || !message) return;

  // 모든 상태 클래스 제거
  field.classList.remove('field-success', 'field-error', 'field-info');
  
  // 새로운 상태 클래스 추가
  if (state !== 'clear') {
    field.classList.add(`field-${state}`);
  }
  
  // 메시지 텍스트 업데이트
  message.textContent = text;
}

// =========================
// ⭐ 별명 중복 확인
// =========================
nicknameCheckBtn.addEventListener('click', checkNickname);

async function checkNickname() {
  const nicknameValue = nickname.value.trim();

  if (!nicknameValue) {
    updateFieldState(nicknameField, nicknameMessage, 'error', '별명을 입력해주세요');
    nicknameVerified = false;
    return;
  }

  try {
    const { data } = await axiosInstance.get<DetailRes<LoginUser>>('/users/name', {
      params: { name: nicknameValue },
    });

    if (data.ok === 1) {
      updateFieldState(nicknameField, nicknameMessage, 'success', '사용 가능한 별명입니다.');
      nicknameVerified = true;
      return;
    }

    nicknameVerified = false;
    updateFieldState(nicknameField, nicknameMessage, 'error', '이미 사용 중인 별명입니다.');

  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || '서버 오류입니다.';
      updateFieldState(nicknameField, nicknameMessage, 'error', errorMessage);
      nicknameVerified = false;
    }
  }
}

// 별명 입력 시 검증 상태 초기화
nickname.addEventListener('input', () => {
  nicknameVerified = false;
  updateFieldState(nicknameField, nicknameMessage, 'clear');
});

// =========================
// ⭐ 이메일 중복 확인
// =========================
emailCheckBtn.addEventListener('click', checkEmail);

async function checkEmail() {
  const emailValue = email.value.trim();

  if (!emailValue) {
    updateFieldState(emailField, emailMessage, 'error', '이메일을 입력해주세요.');
    emailVerified = false;
    return;
  }

  if (!emailValue.includes('@')) {
    updateFieldState(emailField, emailMessage, 'error', '올바른 이메일 형식이 아닙니다.');
    emailVerified = false;
    return;
  }

  try {
    const { data } = await axiosInstance.get<DetailRes<LoginUser>>('/users/email', {
      params: { email: emailValue },
    });

    if (data.ok === 1) {
      emailVerified = true;
      updateFieldState(emailField, emailMessage, 'success', '사용 가능한 이메일입니다.');
      return;
    }

    emailVerified = false;
    updateFieldState(emailField, emailMessage, 'error', '이미 등록된 이메일입니다. 다른 이메일을 입력해주세요.');

  } catch (err) {
    if (axios.isAxiosError(err)) {
      emailVerified = false;
      const errorMessage = err.response?.data?.message || '서버 오류입니다.';
      updateFieldState(emailField, emailMessage, 'error', errorMessage);
    }
  }
}

// 이메일 입력 시 검증 상태 초기화
email.addEventListener('input', () => {
  emailVerified = false;
  updateFieldState(emailField, emailMessage, 'clear');
});

// =========================
// ⭐ 비밀번호 숨김/보기
// =========================
iconEyeBtn1?.addEventListener('click', () => {
  const isHidden = password.type === 'password';
  password.type = isHidden ? 'text' : 'password';
});

iconEyeBtn2?.addEventListener('click', () => {
  const isHidden = passwordCheck.type === 'password';
  passwordCheck.type = isHidden ? 'text' : 'password';
});

// =========================
// ⭐ 비밀번호 일치 검사
// =========================
function passwordCheckLive() {
  const pwd1 = password.value;
  const pwd2 = passwordCheck.value;

  // 비밀번호 확인 필드가 비어있으면 메시지 숨김
  if (!pwd2) {
    updateFieldState(passwordConfirmField, passwordConfirmMessage, 'clear');
    return;
  }

  // 비밀번호 길이 검증
  if (pwd1 && (pwd1.length < 8 || pwd1.length > 16)) {
    updateFieldState(passwordConfirmField, passwordConfirmMessage, 'error', '비밀번호는 8~16자여야 합니다.');
    return;
  }

  // 비밀번호 일치 검사
  if (pwd1 === pwd2 && pwd1.length >= 8) {
    updateFieldState(passwordConfirmField, passwordConfirmMessage, 'success', '비밀번호가 일치합니다.');
  } else {
    updateFieldState(passwordConfirmField, passwordConfirmMessage, 'error', '비밀번호가 일치하지 않습니다.');
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

  const cleanNickname = nickname.value.trim();
  const cleanEmail = email.value.trim();

  if (!nicknameVerified) {
    alert('별명 중복 확인을 해주세요.');
    nickname.focus();
    return;
  }

  if (!emailVerified) {
    alert('이메일 중복 확인을 해주세요.');
    email.focus();
    return;
  }

  if (password.value.length < 8 || password.value.length > 16) {
    alert('비밀번호는 8~16자여야 합니다.');
    password.focus();
    return;
  }

  if (password.value !== passwordCheck.value) {
    alert('비밀번호가 일치하지 않습니다.');
    passwordCheck.focus();
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
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || '회원가입에 실패했습니다.';
      alert(errorMessage);
    } else {
      alert('알 수 없는 오류가 발생했습니다.');
    }
    console.error('회원가입 오류:', err);
  }
});