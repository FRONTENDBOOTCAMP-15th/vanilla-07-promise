// types/upload.ts
import { api } from './apiClient';
import type { PostPayload } from './postApi';

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

  const { data } = await api.post<UploadResponse>('/files/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (data?.url) return data.url;
  if (data?.item && data.item.length > 0) {
    const first = data.item[0];
    if (first.url) return first.url;
    if (first.path) return first.path;
  }
  if (data?.data?.url) return data.data.url as string;

  throw new Error('이미지 URL을 받지 못했습니다.');
}

export async function createPostRequest(
  title: string,
  subtitle: string,
  content: string,
  _getAlign: () => string, // 현재 API 전송에는 사용되지 않음
  file?: File,
): Promise<PostPayload> {
  let imageUrl: string | undefined;
  if (file) {
    imageUrl = await uploadImage(file);
  }

  const payload: PostPayload = {
    title,
    content,
    ...(subtitle ? { subtitle } : {}),
    ...(imageUrl ? { images: imageUrl } : {}),
  } as PostPayload;

  return payload;
}
