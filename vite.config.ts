import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 로컬 개발에서도 배포된 백엔드를 그대로 쓴다. 코드에는 상대 경로(/api/v1)만
    // 남으므로 배포(nginx 가 같은 오리진으로 서빙)와 동작이 같다.
    proxy: {
      '/api': {
        target: 'http://20.196.193.142',
        changeOrigin: true,
      },
    },
  },
})
