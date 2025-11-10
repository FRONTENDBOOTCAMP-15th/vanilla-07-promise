import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      js,
    },
    extends: ['js/recommended'], // Prettier 스타일을 ESLint 규칙으로 적용],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-var': 'error', // var 키워드 사용 가능
      'prefer-const': 'warn', // 변수가 재할당 되지 않는다면 let 대신 const 사용하도록 경고
      'no-redeclare': 1, // 변수 중복 선언시 경고
      // 기타 룰 추가
    },
    ignores: ['.history', 'dist'],
  },
  tseslint.configs.recommended,
]);
