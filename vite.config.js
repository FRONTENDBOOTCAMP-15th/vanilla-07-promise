import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve, basename } from 'path';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// HTML 파일 자동 스캔
const htmlFiles = glob.sync('src/features/**/*.html');

console.log('HTML files found:', htmlFiles);

// Rollup input 객체 생성
const input = htmlFiles.reduce((acc, file) => {
  const key = basename(file, '.html'); // 파일명만 사용

  console.log(typeof acc);
  console.log(key); // 빌드 전에 확인
  acc[key] = resolve(__dirname, file);
  return acc;
}, {});

// 루트 index.html 추가
input['index'] = resolve(__dirname, 'index.html');

console.log(input); // 빌드 전에 확인

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        // 메인 페이지
        index: 'index.html',

        // // 사용자 관련
        // 'user/login': 'src/pages/user/login.html',
        // 'user/signup': 'src/pages/user/signup.html',

        // // 게시판 관련
        // 'board/list': 'src/pages/board/list.html',
        // 'board/new': 'src/pages/board/new.html',
        // 'board/detail': 'src/pages/board/detail.html',
        // 'board/edit': 'src/pages/board/edit.html',

        // // 에러 페이지
        // error: 'src/pages/error.html',
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
});
