import { api } from './apiClient';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();

  formData.append('attach', file);

  try {
    const { data } = await api.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // 백엔드 응답 구조가 예: { ok: true, url: "https://..." }
    if (data?.url) {
      return data.url;
    }

    // item 이나 data.url 형태로 담겨 있을 경우 대응
    if (data?.item?.url) return data.item.url;
    if (data?.data?.url) return data.data.url;

    throw new Error('이미지 URL을 받지 못했습니다.');
  } catch (err) {
    console.error('이미지 업로드 실패:', err);
    throw err;
  }
}
