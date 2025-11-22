import { AxiosError } from 'axios';
import { getAxios } from '../utils/axios';
import type { DetailRes, LoginUser } from '../utils/types';

const axios = getAxios();

// HTML 요소
const emailInput = document.querySelector('#email-input') as HTMLInputElement;
const passwordInput = document.querySelector(
  '#password-input',
) as HTMLInputElement;
const checkBox = document.querySelector(
  '#signin-checkbox-1',
) as HTMLInputElement;
const loginForm = document.querySelector('#login-form') as HTMLFormElement;
const loginBtn = document.querySelector('.login-submit') as HTMLButtonElement;
const signupBtn = document.querySelector('.signup-link') as HTMLAnchorElement;

// 토큰 및 사용자 정보 저장 함수
function saveUserData(user: LoginUser) {
  const { accessToken } = user.token;
  const userData = {
    _id: user._id,
    email: user.email,
    name: user.name,
    image: user.image,
  };

  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('user', JSON.stringify(userData));
}

// 이메일, 비밀번호 입력 후 로그인 버튼 색상 변경, 회원가입 버튼 감추기
passwordInput.addEventListener('input', () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  loginBtn.style.backgroundColor = 'var(--color-primary)';
  signupBtn.style.display = email && password ? 'none' : 'block';
});

// 로그인 폼 제출 처리
loginForm.addEventListener('submit', async event => {
  event.preventDefault();

  const loginData = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    const requestConfig = checkBox.checked
      ? { params: { expiresIn: '1d' } }
      : {};

    const { data } = await axios.post<DetailRes<LoginUser>>(
      '/users/login',
      loginData,
      requestConfig,
    );

    // 토큰 및 사용자 정보 저장
    saveUserData(data.item);

    alert('로그인 성공했습니다');
    location.href = '../../../index.html';
  } catch (err) {
    if (err instanceof AxiosError) {
      alert(`로그인 실패 ${err.response?.data?.message || '알 수 없는 오류'}`);
    } else {
      alert(`로그인 실패: ${err}`);
    }
  }
});
