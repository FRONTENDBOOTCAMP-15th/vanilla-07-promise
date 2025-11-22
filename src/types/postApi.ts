import { api, type ApiItemResponse } from './apiClient';

export interface PostPayload {
  title: string;
  content: string;
  tag?: string[];
  image?: string;
}

export interface PostResponse {
  _id: string;
  title: string;
  content: string;
  tag?: string[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

const postApi = {
  async createPost(
    payload: PostPayload,
  ): Promise<ApiItemResponse<PostResponse>> {
    const { data } = await api.post<ApiItemResponse<PostResponse>>(
      '/posts',
      payload,
    );
    return data;
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
