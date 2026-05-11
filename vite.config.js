import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base를 명시적으로 설정하지 않거나, 빈 문자열 대신 '/'를 확실히 줍니다.
  base: '/', 
  resolve: {
    alias: {
      // 경로 인식 오류를 방지하기 위해 별칭 설정을 추가합니다.
      "@": "/src",
    },
  },
  build: {
    // 빌드 결과물이 나올 폴더명을 명시합니다.
    outDir: 'dist',
  }
})