import { getAxios } from '../axios';
import type { ApiResponse } from '../../../types/search-result-type/search-result-type';
import type { UsersResponse } from '../../../types/search-author-type/search-author-type';

// 게시물 목록조회 api
export async function RequestPostResults(
  page: number,
  keyword: string,
): Promise<ApiResponse> {
  const axios = getAxios();
  const limit = 10;
  try {
    const response = await axios.get<ApiResponse>(`/posts`, {
      params: {
        type: 'brunch',
        keyword,
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error('검색 결과 가져오기 실패', error);

    return {
      ok: 0,
      item: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 1,
      },
    };
  }
}

//회원정보(작가) 조회 api
export async function RequestUserResults(
  page: number = 1,
  searchKeyword: string = '',
  limit: number = 50,
): Promise<UsersResponse> {
  const axios = getAxios();

  const custom = {
    $or: [
      { name: { $regex: searchKeyword, $options: 'i' } },
      { 'extra.keyword': { $regex: searchKeyword, $options: 'i' } },
      { 'extra.biography': { $regex: searchKeyword, $options: 'i' } },
    ],
  };

  try {
    const response = await axios.get<UsersResponse>('/users', {
      params: {
        type: 'user',
        custom: JSON.stringify(custom),
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error('검색 결과 가져오기 실패', error);

    return {
      ok: 0,
      item: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 1,
      },
    };
  }
}
