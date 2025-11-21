// 작가 정보
export interface WriterInfo {
  _id: number; // id
  name: string; // name
  image: 'user-jayg.webp'; // 이미지
  bookmark: {
    users: 4; // 지정한 사용자가 북마크한 사용자 수
  };
  bookmarkedBy: {
    users: 2; // 지정한 사용자를 북마크한 사용자 수
  };
  extra: {
    job: 'edifice 매니저'; // 직업
  };
}

// 구독 인포
export interface SubsInfo {
  bookmark: {
    users: number;
  };
  bookmarkedBy: {
    users: number;
  };
}

// 구독 버튼
export interface Subsbnt {
  target_id: number;
  memo: string;
  extra: {
    type: string;
  };
}

export interface DeleteSubs {
  target_id: number;
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
