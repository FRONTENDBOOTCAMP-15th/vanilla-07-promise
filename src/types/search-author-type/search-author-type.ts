export interface UserItem {
  _id: number;
  email: string;
  name: string;

  type: 'user' | 'seller' | 'admin'; // 고정값
  loginType: 'email' | 'kakao';

  image?: string; // seller, 일부 user에만 존재함

  extra: {
    job: string;
    biography: string;
    keyword: string[];
  };
  createdAt: string;
  updatedAt: string;

  posts: number;

  bookmarkedBy: {
    users: number;
  };

  likedBy: {
    users: number;
  };

  postViews: number;
  totalSales: number;
}
// interface ExtraInfo {
//   job?: string;
//   biography?: string;
//   keyword?: string[];
// }

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersResponse {
  ok: number;
  item: UserItem[];
  pagination: Pagination;
}

//최근 검색어
export type Recent = {
  id: number;
  title: string;
};
