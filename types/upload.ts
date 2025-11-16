import { getAxios } from '../src/features/utils/axios';

interface UploadItem {
  path?: string;
  url?: string;
}
interface UploadResponse {
  url?: string;
  item?: UploadItem[];
  data?: { url?: string };
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  // 서버 요구사항: 파일 필드는 'attach'
  formData.append('attach', file);

  const axiosInstance = getAxios();
  const { data } = await axiosInstance.post<UploadResponse>(
    '/files/',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  if (data?.url) return data.url;
  if (data?.item && data.item.length > 0) {
    const first = data.item[0];
    if (first.url) return first.url;
    if (first.path) return first.path;
  }
  if (data?.data?.url) return data.data.url as string;

  throw new Error('이미지 URL을 받지 못했습니다.');
}

export interface PostPayload {
  _id: number;
  type: 'brunch';
  title: string;
  extra: {
    subtitle: string;
    align: string;
  };
  content: string;
  createdAt: string;
  image: string;
}

export async function createPostRequest(
  title: string,
  subtitle: string,
  content: string,
  getAlign: () => string,
  file?: File,
): Promise<PostPayload> {
  let imageUrl = '';
  if (file) {
    imageUrl = await uploadImage(file);
  }

  return {
    _id: Date.now(),
    type: 'brunch',
    title,
    extra: {
      subtitle,
      align: getAlign(),
    },
    content,
    createdAt: new Date().toISOString(),
    image: imageUrl,
  };
}
