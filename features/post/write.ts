import axios from 'axios';

const form = document.querySelector('.post-form') as HTMLFormElement;
const formBtn = document.querySelector('.submit-Btn') as HTMLFormElement;
const RegisterSvg = document.querySelector(
  '.Register-icon path',
) as SVGPathElement;



//파일 업로드를 제외한 input요소
const inputs = Array.from(form.querySelectorAll('input, textarea')).filter(
  (el): el is HTMLInputElement =>
    !(el instanceof HTMLInputElement && el.type === 'file'),
);

// 입력 변화 감지 (모두 입력시 등록하기 버튼 이미지 대체)
inputs.forEach(input => input.addEventListener('input', checkInputs));

function checkInputs(): void {
  const allFilled = inputs.every(input => input.value.trim() !== '');

  if (allFilled) {
    RegisterSvg.setAttribute('stroke', '#00C6BE');
  } else {
    RegisterSvg.setAttribute('stroke', '#444444');
  }
}



//submit 통제
formBtn.addEventListener('click', () => {
  const allFilled = inputs.every(input => input.value.trim() !== '');

  if (allFilled === true) {
    const formData = new FormData(form);

    axios
      .post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      .then(response => {
        console.log('전송 성공', response.data);
      })
      .catch(err => {
        console.error('전송 실패', err);
        alert('등록을 실패했습니다.');
      });
  } else {
    alert('모든항목을 입력해주세요');
  }
});


//input focus 시 키보드 svg 변경