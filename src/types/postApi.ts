import { api, type ApiItemResponse } from './apiClient';
import { uploadImage } from './upload';

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
      console.log(
        '[postApi] POST /posts 요청:',
        JSON.stringify(payload, null, 2),
      );
      console.log(
        '[postApi] 이미지 필드 확인 - image:',
        payload.image,
        'images:',
        payload.images,
      );

      const { data } = await api.post<ApiItemResponse<PostResponse>>(
        '/posts',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('[postApi] POST /posts 응답:', JSON.stringify(data, null, 2));
      console.log(
        '[postApi] 응답된 이미지 필드 - images:',
        data?.data?.images || data?.item?.images,
      );

      return data;
    } catch (error) {
      console.error('[postApi] POST /posts 실패:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: unknown; status?: number };
        };
        console.error('[postApi] 응답 상태:', axiosError.response?.status);
        console.error('[postApi] 응답 데이터:', axiosError.response?.data);
      }
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
    type: 'febc15-vanilla07-ecad',
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
