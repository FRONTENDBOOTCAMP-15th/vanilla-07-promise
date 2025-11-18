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
  base: '/',
  appType: 'mpa',
  build: {
    rollupOptions: {
      input,
    },
  },
});
