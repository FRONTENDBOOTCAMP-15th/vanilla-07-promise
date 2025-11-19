import { AxiosError } from 'axios';
import { getAxios } from '../utils/axios';
import type { DetailRes, LoginUser } from '../utils/types.ts';

const axios = getAxios();

//html 요소
const emailInput = document.querySelector('#email-input') as HTMLInputElement;
const passwordInput = document.querySelector(
  '#password-input',
) as HTMLInputElement;
const checkBox = document.querySelector(
  '#signin-checkbox-1',
) as HTMLInputElement;
const loginForm = document.querySelector('#login-form') as HTMLInputElement;
const loginBtn = document.querySelector('.login-submit') as HTMLInputElement;
const signupBtn = document.querySelector('.signup-link') as HTMLAnchorElement;
const jobInput = document.querySelector(
  'input[placeholder="job"]',
) as HTMLInputElement;
const biographyInput = document.querySelector(
  'input[placeholder="biography"]',
) as HTMLInputElement;
const keywordInput = document.querySelector(
  'input[placeholder="keyword(초코, 별, 사탕)"]',
) as HTMLInputElement;

//이메일, 비밀번호 입력 후 로그인 버튼 색상변경, 회원가입 버튼 감추기
passwordInput.addEventListener('input', () => {
  const email = emailInput.value;
  const pwd = passwordInput.value;

  if (email && pwd) {
    loginBtn.style.backgroundColor = 'var(--color-primary)';
    signupBtn.style.display = 'none';
  } else {
    loginBtn.style.backgroundColor = 'var(--color-primary)';
    signupBtn.style.display = 'block';
  }
});

loginForm.addEventListener('submit', async event => {
  event.preventDefault();

  const login = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    let responseData: DetailRes<LoginUser>;
    if (checkBox.checked) {
      const { data } = await axios.post<DetailRes<LoginUser>>(
        '/users/login',
        login,
        { params: { expiresIn: '1d' } },
      );
      const accessToken = data.item.token.accessToken;
      localStorage.setItem('accessToken', accessToken);
      responseData = data;
    } else {
      const { data } = await axios.post<DetailRes<LoginUser>>(
        '/users/login',
        login,
      );
      const accessToken = data.item.token.accessToken;
      sessionStorage.setItem('accessToken', accessToken);
      responseData = data;
    }

    // 사용자 정보에서 job, biography, keyword 가져와서 입력 필드에 채우기
    // 응답 데이터에서 extra 정보 확인 (타입 단언 사용)
    const userExtra = (
      responseData.item as unknown as {
        extra?: { job?: string; biography?: string; keyword?: string[] };
      }
    )?.extra;
    if (userExtra) {
      if (jobInput && userExtra.job) {
        jobInput.value = userExtra.job;
      }
      if (biographyInput && userExtra.biography) {
        biographyInput.value = userExtra.biography;
      }
      if (keywordInput && userExtra.keyword) {
        const keywordArray = userExtra.keyword;
        keywordInput.value = Array.isArray(keywordArray)
          ? keywordArray.join(', ')
          : '';
      }
    }

    alert('로그인 성공했습니다');
    location.href = '../../../index.html';
  } catch (err) {
    if (err instanceof AxiosError) {
      alert(`로그인 실패: ${err.response?.data?.message || '알 수 없는 오류'}`);
    } else {
      alert(`로그인 실패: ${err}`);
    }
  }
});
