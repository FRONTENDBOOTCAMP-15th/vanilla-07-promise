import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // 메인 페이지
        index: 'index.html',
        nav: path.resolve(__dirname, './src/common/nav.html'),
        header: path.resolve(__dirname, './src/common/header.html'),
        trending: path.resolve(
          __dirname,
          './src/features/home/trending-brunch.html',
        ),

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
