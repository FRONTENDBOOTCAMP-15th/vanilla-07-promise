// 작가 정보
export interface WriterInfo {
  _id: number; // id
  name: string; // name
  image: 'user-jayg.webp'; // 이미지
  // bookmark: {
  //   users: 4; // 지정한 사용자가 북마크한 사용자 수
  // };
  // bookmarkedBy: {
  //   users: 2; // 지정한 사용자를 북마크한 사용자 수
  // };
  extra: {
    job: 'edifice 매니저'; // 직업
  };
}
