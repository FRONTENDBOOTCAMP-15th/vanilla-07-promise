# 7조 Promise: 브런치 스토리
<br>

![브런치 스토리](https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA4MTlfMjAw%2FMDAxNjkyNDI0ODUyNzYz.smYd3p6s6Hl2RYCT8BsbuNDUUPQwh84dIK-t_JAFRTgg.iSA8rE1iOotyForzf7X0D1aByMfBESV2PkySe6NH50cg.PNG.sanctacrux%2F%253F%258B%25A4%253F%259A%25B4%25EB%25A1%259C%25EB%2593%259C.png&type=l340_165)

<br>

## 🚀 프로젝트 개요  
“모바일 중심의 창작 경험을 혁신하는  
프리미엄 작가 글쓰기 플랫폼 개발”   

본 프로젝트는 브런치(Brunch) 플랫폼의 글쓰기 경험과 콘텐츠 생태계를 기반으로,  모바일 환경에서의 사용성·
접근성을 대폭 향상시키는 것을 목표로 한다.

<br>
<br>

## 🕖기간
2025.11.10 ~ 2025.11.21

<br>
<br>

## 🧑‍💻 팀원 역할 및소개

| ![김현주]() | ![이승규]() | ![김은재]() | ![윤소라]() |
|:--:|:--:|:--:|:--:|
| **김현주**  | **이승규** | **김은재**  | **윤소라**  |
| 조장(PM), PM | PL | 서기 | 발표 |
| 로그인 및 글쓰기 | 발견(관련 키워드 검색) | 메인 및 상세 페이지 | 마이페이지, 작가 홈 및 내 서랍 페이지 |



<br>
<br>

## 🛠️ 기술스택  
![다이어그램](https://cdn.discordapp.com/attachments/1402552622879215727/1441691012031451156/aa334db4024033fc.png?ex=6922b6e2&is=69216562&hm=95743d768c541f71b2100d3a7e26133ccce1b5206afaff30afa429aab90b3a4c&)


<br>
<br>

## 🤝 협업 방식  

### 작업 분배 방식
**기능 단위 분리 방식**
- 메인 페이지
- 상세 페이지
- 로그인 페이지
- 글쓰기 및 등록
- 발견
- 내 서랍 페이지
- 작가 홈 페이지
기능 단위로 작업을 분리하여 개발

<hr>

**우선순위 기반 할당**
- 필수 기능(글 검색, 관심 작가)
- 선택 기능(공유, 택스트 정렬)
- 추가 기능(로그인 후 헤더에 사진 누를 시 수정)
  
<hr>

**모듈 단위 개발**
- 기능 단위를 웹 컴포넌트(Header, Nav 등)나 모듈로 나누어 개발함하여
변경·추가 시 충돌을 줄이고 유지보수성을 높였음

<br>
<br>

### 소통 및 이슈 관리 방법
**소통 방식**
- 메신저 기반 실시간 소통(디스코드)
- 오전마다 데일리 스크럼 진행, 수업 이후 상황 공유

<hr>

**이슈 관리 방식**
- GitHub Issues 활용(기능 세분화 한 것들을 이슈로 등록 한 후 커밋 메세지 컨벤션 준수하여 등록)
- Git Branch 전략 적용(기능별 브랜치 생성)

<hr>

**PR기반 협업 프로세스 추가**
- PR을 통한 코드 검토 및 반영
- 기능 개발이 완료된 브랜치를 PR로 제출
- 코드 리뷰 후 메인 브랜치 병합

<hr>

**작업 현황 시각적 관리**
- Notion을 활용하여 실시간으로 작업 상태 관리
 
<br>
<br>

## ✨ 기능 소개 

### 🎯메인 페이지
- 요즘 뜨는 브런치
- Top 구독 작가
<img width="300" height="450" alt="스크린샷 2025-11-22 163214" src="https://github.com/user-attachments/assets/e2955c5d-039f-4a27-92c7-0c6c5e3dcbb7" />
<img width="300" height="450" alt="스크린샷 2025-11-22 163234" src="https://github.com/user-attachments/assets/ec0dac55-6713-4c42-968e-7edfb2dde469" />

<hr>

### 📚상세 페이지
- 구독 등록/취소
- 좋아요 등록/취소
<img width="300" height="450" alt="스크린샷 2025-11-22 164958" src="https://github.com/user-attachments/assets/721a1b06-0bea-4a35-ab9a-55b7ebe3d3c7" />
<img width="300" height="450" alt="스크린샷 2025-11-22 165308" src="https://github.com/user-attachments/assets/7a92415b-a398-4657-80db-fcca7670ab19" />



<hr>

### 🔓로그인 페이지
- 이메일 회원 가입(로그인)
<img width="300" height="450" alt="스크린샷 2025-11-22 165115" src="https://github.com/user-attachments/assets/2ec3572f-9077-4ce9-816c-670fd20c573a" />
<img width="300" height="450" alt="스크린샷 2025-11-22 165239" src="https://github.com/user-attachments/assets/fa58ffb5-b2e1-4364-a233-b0ca620e1c2a" />



<hr>

### ✍️글쓰기 및 등록
- 파일 첨부
- 글쓰기
<img width="300" height="440" alt="스크린샷 2025-11-22 165414" src="https://github.com/user-attachments/assets/c2b35cdd-5f10-4590-9189-bf8996970f66" />
<img width="300" height="450" alt="스크린샷 2025-11-22 165515" src="https://github.com/user-attachments/assets/f1794a83-4623-434b-a181-49c40fcf906f" />



<hr>

### 🔎발견(관련 키워드 검색)
- 발견 기능 UI 작업
- 글 검색
- 작가 검색
<img width="300" height="450" alt="스크린샷 2025-11-22 165542" src="https://github.com/user-attachments/assets/2452a480-3e71-4aa4-baa6-20cddc63d684" />
<img width="300" height="440" alt="스크린샷 2025-11-22 165613" src="https://github.com/user-attachments/assets/c25f7a2d-c90b-4c6a-97a3-f0f93c6483eb" />



<hr>

### 📄내 서랍 페이지
- 관심 작가
- 최근 본 글
- 관심 글
- 내 브런치
  
  <img width="300" height="450" alt="스크린샷 2025-11-22 170221" src="https://github.com/user-attachments/assets/3eb24f58-1e20-40c1-b80e-a8c6e1a2476c" />


<hr>

### ✏️작가 홈
- 작가 정보
- 구독/ 구독 취소
- 작가의 글 목 목록
<img width="300" height="445" alt="스크린샷 2025-11-22 170557" src="https://github.com/user-attachments/assets/aa93e422-62b9-4db1-a5ba-d2c9ca98b41f" />
<img width="300" height="450" alt="스크린샷 2025-11-22 170606" src="https://github.com/user-attachments/assets/762025e5-743e-4d7a-8ae3-5b762da49d01" />

<br>
<br>


## 🔧 기술 구현 상세  
- 폴더 구조: (승규님 수정 후 반영 예정 – 공간 확보)  
- 아키텍처 다이어그램: 디스코드 제공 사진 사용 (승규님 준비 중)  

- **🛠 트러블 슈팅**

| 이름 | 문제 상황 | 해결 방법 |
|:--:|:--:|:--:|
| **김현주** | | |
| **이승규** | | |
| **김은재** | | |
| **윤소라** | | |


<br>
<br>

## 🎬 기능 시연  
- 배포 링크: [브런치 스토리](https://07-promise.netlify.app/)

<br>
<br>

## 💭 회고 및 느낀점  

| 이름 | 아쉬운 점 | 성장 경험 |
|:--:|:--:|:--:|
| **김현주** | | |
| **이승규** | | |
| **김은재** | | |
| **윤소라** | | |
