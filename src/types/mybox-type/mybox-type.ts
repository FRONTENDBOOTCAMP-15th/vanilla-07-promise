// 관심 작가
export interface FavWriter {
  user: {
    _id: number;
    name: string;
    image: string;
  };
}

// 관심 글
export interface FavPost {
  post: {
    _id: number;
    image: string;
    title: string;
    user: {
      name: string;
    };
  };
}

// 내 브런치
export interface MyBrunch {
  _id: number;
  title: string;
  content: string;
}
