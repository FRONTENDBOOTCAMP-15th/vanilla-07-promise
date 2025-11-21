// 작가 정보
export interface WriterInfo {
  _id: number; // id
  name: string; // name
  image: 'user-jayg.webp'; // 이미지
  extra: {
    job: 'edifice 매니저'; // 직업
  };
}

// 관심 작가 count
export interface SubsInfo {
  bookmark: {
    users: number;
  };
}

// 작가 글 리스트
export interface WriteList {
  _id: number;
  title: string;
  content: string;
  user: {
    _id: number;
  };
  repliesCount: number;
  createdAt: string;
}
