
// 게시물 목록조회 API item
export interface ResultItem {
  _id: number;
  type: string;
  title: string;
  extra: {
    subtitle: string;
    align: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  image: string | null;
  views: number;
  user: {
    _id: number;
    name: string;
    image?: string | null; // 이미지가 없을 수도 있으니 optional
  };
  seller_id: number | null;
  bookmarks: number;
  likes: number;
  repliesCount: number;
  product: {
    image: string | null;
  };
}

// 게시물 목록조회 API 
export interface ApiResponse {
  ok: number;
  item: ResultItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

//최근 검색어 
export type Recent = {
  id: number;
  title: string;
};