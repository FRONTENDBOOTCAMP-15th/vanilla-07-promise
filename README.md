# 7조 Promise: 브런치 스토리
<br>

<img width="750" height="350" alt="image" src="https://github.com/user-attachments/assets/8ebcb661-c92a-45da-ac00-cf05b973a8f7" />
<!-- <img width="900" height="200" alt="image" src="https://github.com/user-attachments/assets/1e85f3e5-3ef1-42fb-95e5-41894ce15479" /> -->



<br>

## 🚀 프로젝트 개요  
“모바일 중심의 창작 경험을 혁신하는  
프리미엄 작가 글쓰기 플랫폼 개발”   

본 프로젝트는 브런치 플랫폼의 글쓰기 경험과 콘텐츠 생태계를 기반으로,  모바일 환경에서의 사용성·
접근성을 대폭 향상시키는 것을 목표로 한다.

<br>
<br>

## 🕖기간
2025.11.10 ~ 2025.11.21

<br>
<br>

## 🧑‍💻 팀원 역할 및소개

| <img src="https://github.com/user-attachments/assets/195ebe45-3b18-4285-ae05-0476f538d092" width="150"/> | <img src="https://github.com/user-attachments/assets/195f8051-bb99-48a6-8ef0-2c26110fc7aa" width="150"/> | <img src="https://github.com/user-attachments/assets/2529e66e-b59a-4b0d-932c-78fa90b33ca0" width="150"/> | <img src="https://github.com/user-attachments/assets/03f33f4a-2afa-4f51-bd7a-5964522483a7" width="150"/> |
|:--:|:--:|:--:|:--:|
| **김현주** | **이승규** | **김은재** | **윤소라** |
| 조장(PM) | PL | 서기 | 발표 |
| 로그인 및 글쓰기 | 발견 (관련 키워드 검색) | 메인 및 상세 페이지 | 작가 홈 및 내 서랍 페이지 |





<br>
<br>

## 🛠️ 기술스택  
![다이어그램](https://cdn.discordapp.com/attachments/1402552622879215727/1441691012031451156/aa334db4024033fc.png?ex=6922b6e2&is=69216562&hm=95743d768c541f71b2100d3a7e26133ccce1b5206afaff30afa429aab90b3a4c&)


<br>
<br>

## 🤝 협업 방식  

<br>

### 📚작업 분배 방식
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
- 선택 기능(텍스트 정렬)
- 추가 기능(로그인 후 헤더에 사진 누를 시 수정)
  
<hr>

**모듈 단위 개발**
- 기능 단위를 웹 컴포넌트(Header, Nav 등)나 모듈로 나누어 개발함하여
변경·추가 시 충돌을 줄이고 유지보수성을 높였음

<br>
<br>

### 🗨️소통 및 이슈 관리 방법
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
- ✔️요즘 뜨는 브런치
- ✔️Top 구독 작가
<img width="300" height="433" alt="스크린샷 2025-11-22 182502" src="https://github.com/user-attachments/assets/8fc8a55a-1b6c-4c12-86c9-4d247c276e86" />
<img width="300" height="450" alt="스크린샷 2025-11-23 222908" src="https://github.com/user-attachments/assets/3e37057a-709a-47f7-ad35-f462efed9d57" />


<hr>

### 📚상세 페이지
- ✔️구독 등록/취소
- ✔️좋아요 등록/취소
<img width="300" height="450" alt="스크린샷 2025-11-22 164958" src="https://github.com/user-attachments/assets/721a1b06-0bea-4a35-ab9a-55b7ebe3d3c7" />
<img width="300" height="450" alt="스크린샷 2025-11-22 165308" src="https://github.com/user-attachments/assets/7a92415b-a398-4657-80db-fcca7670ab19" />



<hr>

### 🔓로그인 페이지
- ✔️이메일 회원 가입(로그인)
- ✔️마이페이지
<img width="300" height="445" alt="스크린샷 2025-11-22 165115" src="https://github.com/user-attachments/assets/2ec3572f-9077-4ce9-816c-670fd20c573a" />
<img width="300" height="450" alt="image" src="https://github.com/user-attachments/assets/c8367610-3d92-4ac9-a9fa-2ad283458511" />




<hr>

### ✍️글쓰기 및 등록
- ✔️파일 첨부
- ✔️글쓰기
<img width="300" height="436" alt="스크린샷 2025-11-23 224953" src="https://github.com/user-attachments/assets/47cdda21-c987-404e-ae66-a70247113a7d" />
<img width="300" height="450" alt="스크린샷 2025-11-23 223352" src="https://github.com/user-attachments/assets/da735dee-6670-439c-9585-a12db13684cf" />




<hr>

### 🔎발견(관련 키워드 검색)
- ✔️발견 기능 UI 작업
- ✔️글 검색
- ✔️작가 검색
<img width="300" height="450" alt="스크린샷 2025-11-22 165542" src="https://github.com/user-attachments/assets/2452a480-3e71-4aa4-baa6-20cddc63d684" />
<img width="300" height="440" alt="스크린샷 2025-11-22 165613" src="https://github.com/user-attachments/assets/c25f7a2d-c90b-4c6a-97a3-f0f93c6483eb" />



<hr>

### 📄내 서랍 페이지
- ✔️관심 작가
- ✔️최근 본 글
- ✔️관심 글
- ✔️내 브런치
<img width="300" height="435" alt="스크린샷 2025-11-23 223013" src="https://github.com/user-attachments/assets/44534eea-70cf-45fc-a91a-77787e79302e" />
<img width="300" height="450" alt="스크린샷 2025-11-23 223405" src="https://github.com/user-attachments/assets/f9c6d881-44b8-4696-b0bb-70e5bbc35d63" />





<hr>

### ✏️작가 홈
- ✔️작가 정보
- ✔️구독/ 구독 취소
- ✔️작가의 글 목 목록
<img width="300" height="445" alt="스크린샷 2025-11-22 170557" src="https://github.com/user-attachments/assets/aa93e422-62b9-4db1-a5ba-d2c9ca98b41f" />
<img width="300" height="450" alt="스크린샷 2025-11-22 170606" src="https://github.com/user-attachments/assets/762025e5-743e-4d7a-8ae3-5b762da49d01" />

<br>
<br>


## 🔧 기술 구현 상세  


 **🪢시스템 흐름도**
 
 <img width="600" height="500" alt="image" src="https://github.com/user-attachments/assets/c0769036-aa00-4db8-b889-3efbe4d60236" />

<br>
<br>

**🗂️폴더 구조**

 ```
 📦 vanilla-07-promise              // 프로젝트 루트
│
├── 🗂️ .github                     // GitHub 워크플로우/Actions 등 자동화 설정
├── 🗂️ .vscode                     // VSCode 편집기 설정
│
├── 📁 api                         // 서버/DB 관련 유틸리티 및 테스트용 리소스
│   ├── 📁 bruno                   // Bruno API 테스트 파일
│   └── 📁 dbinit                  // DB 초기화 스크립트
│
├── 📁 dist                        // Vite 빌드 결과물(배포 파일)
├── 📁 node_modules                // npm 패키지들이 저장되는 폴더
│
├── 📁 public                      // 정적 리소스(빌드 없이 접근 가능)
│   ├── 📁 assets                  // 이미지, CSS, 컴포넌트 등 모든 정적 자원
│   │   ├── 🎨 components          // header, nav 등 공통 UI 컴포넌트 CSS
│   │   │   ├── header.css
│   │   │   └── nav.css
│   │   │
│   │   ├── 🎨 css                 // 전역 스타일 폴더
│   │   │   └── 🎨 base            // reset/variables/theme 등 기초 스타일 파일
│   │   │      ├── base.css
│   │   │      ├── global.css
│   │   │      ├── reset.css
│   │   │      ├── theme.css
│   │   │      └── variables.css
│   │   │
│   │   ├── 🖼️ images              // 모든 PNG/SVG 이미지 및 아이콘
│   │   │   ├── detail / login / mybox-icons / nav-icons ...
│   │   │   ├── trending-1.png ~ trending-10.png
│   │   │   └── 다양한 SVG, PNG 파일들
│   │   │
│   │   └── 🎨 common.css          // 공통 스타일
│   │
│   └── 🖼️ vite.svg                // Vite 기본 아이콘
│
├── 📁 src                         // 실제 애플리케이션 로직이 들어가는 핵심 폴더
│   ├── 📁 common                  // 공통 header/nav/토큰 관리/재사용 함수
│   │   ├── header.html
│   │   ├── header.ts
│   │   ├── like.ts
│   │   ├── nav.html
│   │   ├── nav.ts
│   │   ├── sub-section.ts
│   │   └── token.ts
│   │
│   ├── 📁 components              // 재사용 가능한 UI 컴포넌트
│   │   └── NoDataSearchPage.ts    // 검색에서 데이터 없을 때 보여줄 컴포넌트
│   │
│   ├── 📁 features                // 페이지(기능) 단위 모듈
│   │   ├── 📁 detail              // 상세보기 페이지
│   │   │   ├── detail.css
│   │   │   ├── detail.html
│   │   │   └── detail.ts
│   │   │
│   │   ├── 📁 home                // 홈 화면 기능
│   │   │   ├── home.html
│   │   │   ├── index.css
│   │   │   ├── index.ts
│   │   │   ├── top-author.css / top-author.html / top-author.ts
│   │   │   ├── trending-brunch.css / trending-brunch.html / trending-brunch.ts
│   │   │
│   │   ├── 📁 login               // 로그인 페이지
│   │   │   ├── login.css
│   │   │   ├── login.html
│   │   │   └── login.ts
│   │   │
│   │   ├── 📁 mybox               // 내보관함(My Box) 페이지
│   │   │   ├── mybox.css
│   │   │   ├── mybox.html
│   │   │   ├── mybox.ts
│   │   │   └── recent.ts
│   │   │
│   │   ├── 📁 mypage              // 마이페이지
│   │   │   ├── mypage.css
│   │   │   ├── mypage.html
│   │   │   └── mypage.ts
│   │   │
│   │   ├── 📁 search              // 검색 기능
│   │   │   ├── 📁 search-author   // 작가 검색
│   │   │   ├── 📁 search-nodata   // 검색 결과 없을 때
│   │   │   ├── 📁 search-result   // 검색 결과 페이지
│   │   │   ├── search.css
│   │   │   ├── search.html
│   │   │   └── search.ts
│   │   │
│   │   ├── 📁 signup              // 회원가입 페이지
│   │   │   ├── signup.css
│   │   │   ├── signup.html
│   │   │   └── signup.ts
│   │   │
│   │   ├── 📁 utils               // 공통 유틸리티 함수들
│   │   │   ├── pages              // 페이징 처리 관련
│   │   │   ├── auth.ts            // 인증 로직
│   │   │   ├── axios.ts           // axios 인스턴스 설정
│   │   │   ├── checklogin.ts      // 로그인 여부 확인
│   │   │   └── types.ts           // 공통 타입
│   │   │
│   │   ├── 📁 write               // 글쓰기 페이지
│   │   │   ├── write.css
│   │   │   ├── write.html
│   │   │   └── write.ts
│   │   │
│   │   └── 📁 writerhome          // 작가 홈(브런치 스타일)
│   │       ├── writerhome.css
│   │       ├── writerhome.html
│   │       └── writerhome.ts
│   │
│   ├── 📁 types                   // 전역 타입 정의
│   │   ├── mybox-type / mybox-type.ts
│   │   ├── search-author-type / search-author-type.ts
│   │   ├── search-result-type / search-result-type.ts
│   │   ├── writerhome-type / writerhome-type.ts
│   │   ├── apiClient.ts
│   │   ├── postApi.ts
│   │   └── upload.ts
│   │
│   ├── 💡 main.ts                 // 앱 진입 파일
│   ├── 💡 counter.ts              // 예제용 코드(템플릿)
│   ├── 🎨 style.css               // 전역 스타일
│   └── 🖼️ typescript.svg          // TS 로고 이미지
│
├── ⚙️ .gitignore                  // Git에 포함하지 않을 파일 목록
├── ⚙️ eslint.config.js            // ESLint 설정
├── 📄 index.html                  // 프로젝트 기본 HTML
├── 📦 package.json                // npm 패키지 설정 및 스크립트
├── 📦 package-lock.json           // 패키지 버전 고정 파일
├── ⚙️ prettier.config.js          // Prettier 코드 스타일 설정
├── 📄 [README.md](http://readme.md/)                   // 프로젝트 설명 문서
├── 📄 test.txt                    // 테스트 파일
├── ⚙️ tsconfig.json               // TypeScript 설정
└── ⚙️ vite.config.js              // Vite 번들 설정
```

## 🎬 기능 시연  
- 배포 링크: [브런치 스토리](https://07-promise.netlify.app/)

<br>
<br>

## 🛠 트러블 슈팅


| 이름👨‍👩‍👧‍👦 | 문제 상황 | 해결 방법 |
|:--:|:--|:--|
| **현주** | 배포 시 글쓰기에 이미지 업로드가 안됨 | 타입 정의할 때 `image`에 `?`를 안 붙이고 `images`를 하나 더 만들어버림 |
| **승규** | 1번 페이지와 2번 페이지가 같은 HTTP 메소드와 동일한 파라미터로 요청을 보내는데도, 결과가 다르게 나오는 현상을 발견 | 기존에 UI를 수정할 때 브라우저 캐시로 인해 변경 사항이 즉시 반영되지 않았던 경험을 떠올리며, 이번에는 Axios API 호출에도 캐시가 적용될 수 있는지를 확인|
| **은재** | 브런치 목록 중 `content`에 HTML 태그가 들어가 있어 글이 깨지는 현상 발생 | HTML 태그 제거 함수를 만들어 처리함 |
| **소라** | Axios 요청 작성, 응답 타입 정의, 에러 처리, Bruno로 API 테스트 과정에서 다수의 오류 발생 | Bruno로 실제 응답 구조를 확인하고, 오류는 개발자 도구로 디버깅하며 해결 |


<br>
<br>



## 💭 회고 및 느낀점

| 이름👨‍👩‍👧‍👦 | 아쉬운 점 | 성장 경험 |
|:--:|:--|:--|
| **현주** | 선택 기능 중 하나인 카카오톡 로그인을 구현하지 못한 점 | `api`, `async/await`를 사용하는 데 익숙해지며 점점 적응함 |
| **승규** | 컨벤션부터 파일 구조까지 모든 틀을 완벽하게 갖췄다고 생각했지만, 실제 개발 과정에서는 구석구석 예상치 못한 요소들이 계속해서 나타남 | 다음 파이널 프로젝트에서는 전체적인 설계 단계에서부터 더 체계적이고 일관성 있는 규칙을 세워, 프로젝트 전반에 걸쳐 통일성을 유지할 수 있을 것이라는 점을 깨달음|
| **은재** | 여러 부분을 확인하지 않고 코드를 짜 오류가 생기거나 기능이 빠진 점 | 시간이 걸리더라도 기초를 지키며 꼼꼼하게 짜야 한다는 점을 체감함 |
| **소라** | API와 Axios를 능숙하게 다루고 싶었지만, 각종 오류 해결에 시간이 많이 소요된 점 | 코드를 짜고 오류를 해결하는 과정을 통해 감을 익히며 성장  |

