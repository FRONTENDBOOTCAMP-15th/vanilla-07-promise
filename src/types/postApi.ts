import { api, type ApiItemResponse } from './apiClient';

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

export default postApi;
