import {AxiosError} from 'axios';
import {getAxios} from '../utils/axios';
import type { DetailRes, LoginUser } from '../utils/types.ts';


const axios = getAxios();

//html 요소
const emailInput = document.querySelector('#email-input') as HTMLInputElement;
const passwordInput = document.querySelector('#password-input') as HTMLInputElement;
const checkBox = document.querySelector('#signin-checkbox-1') as HTMLInputElement;
const loginForm = document.querySelector('#login-form') as HTMLInputElement;
const loginBtn = document.querySelector('.login-submit') as HTMLInputElement;
const signupBtn = document.querySelector('.signup-link') as HTMLAnchorElement;

//이메일, 비밀번호 입력 후 로그인 버튼 색상변경, 회원가입 버튼 감추기
passwordInput.addEventListener('input', () => {
  const email = emailInput.value;
  const pwd = passwordInput.value;

  if(email && pwd) {
    loginBtn.style.backgroundColor = "var(--color-primary)";
    signupBtn.style.display = 'none';
  }else {
    loginBtn.style.backgroundColor = 'var(--color-primary)';
    signupBtn.style.display = 'block';
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const login = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    if(checkBox.checked) {
      const {data} = await axios.post<DetailRes<LoginUser>>('/users/login', login, {params: {expiresIn: '1d'}});
      const accessToken = data.item.token.accessToken;
      localStorage.setItem('accessToken', accessToken);
    } else {
      const {data} = await axios.post<DetailRes<LoginUser>>('/users/login', login);
      const accessToken = data.item.token.accessToken;
      sessionStorage.setItem('accessToken', accessToken);
    }

    alert('로그인 성공했습니다');
    location.href = '../../../index.html';
  }catch (err) {
    if (err instanceof AxiosError) {
      alert(`로그인 실패: ${err.response?.data?.message || '알 수 없는 오류'}`);
    }else {
      alert(`로그인 실패: ${err}`);
    }
  }
});