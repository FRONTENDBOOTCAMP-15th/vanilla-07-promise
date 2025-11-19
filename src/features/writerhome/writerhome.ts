// 작가 정보

import { TEMP_TOKEN } from '../../common/token';
import type { WriterInfo } from '../../types/writerhome-type/writerhome-type';
import { getAxios } from '../utils/axios';

function getWriterId(): number {
  const params = new URLSearchParams(location.search);
  return Number(params.get('_id'));
}

async function getWriterInfoData() {
  const axios = getAxios();
  const writerId = getWriterId();

  if (!writerId) {
    console.error('URL에서 id를 찾을 수 없습니다.');
    return;
  }

  try {
    const { data } = await axios.get(`/users/${writerId}`, {
      headers: {
        Authorization: `Bearer ${TEMP_TOKEN}`,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}

function renderWriterInfo(Info: WriterInfo) {
  const list = document.querySelector('.writer-card__profile');
  const noImg =
    Info.image && Info.image.startsWith('http')
      ? Info.image
      : '/assets/images/mybox-icons/no-img.svg';

  if (list) {
    list.innerHTML = `
    <div class="writer-card__info">
    <p class="writer-card__name">${Info.name}</p>
    <p class="writer-card__job">${Info.extra?.job ?? ''}</p>
    </div>
    <img src=${noImg} alt="작가프로필" />
    `;
  }
}

const writerInfoData = await getWriterInfoData();

if (writerInfoData?.ok) {
  renderWriterInfo(writerInfoData.item);
}
