import { api, type ApiItemResponse } from './apiClient.ts';

export interface PostPayload {
  type?: string;
  title: string;
  content: string;
  subtitle?: string;
  image?: string;
  images?: string;
  tag?: string;
  extra?: {
    subtitle?: string;
    align?: string;
  };
}

export interface PostResponse {
  _id: string;
  title: string;
  content: string;
  subtitle?: string;
  images?: string;
  createdAt?: string;
  updatedAt?: string;
}

const postApi = {
  async createPost(
    payload: PostPayload,
  ): Promise<ApiItemResponse<PostResponse>> {
    try {
      console.log('[postApi] POST /posts 요청:', payload);
    const { data } = await api.post<ApiItemResponse<PostResponse>>(
      '/posts',
      payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('[postApi] POST /posts 응답:', data);
    return data;
    } catch (error) {
      console.error('[postApi] POST /posts 실패:', error);
      throw error;
    }
  },

  async updatePost(
    id: string,
    payload: Partial<PostPayload>,
  ): Promise<ApiItemResponse<PostResponse>> {
    const { data } = await api.patch<ApiItemResponse<PostResponse>>(
      `/posts/${id}`,
      payload,
    );
    return data;
  },

  async deletePost(id: string): Promise<ApiItemResponse<null>> {
    const { data } = await api.delete<ApiItemResponse<null>>(`/posts/${id}`);
    return data;
  },
};

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

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

export async function createPostRequest(
  title: string,
  subtitle: string,
  content: string,
  getAlign: () => string,
  file?: File,
) {
  let imageUrl = '';
  if (file) {
    // 업로드 API 호출해서 URL 받아오기
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
    image: imageUrl, // ← 업로드 API에서 받은 URL 저장
  };
}

export default postApi;
