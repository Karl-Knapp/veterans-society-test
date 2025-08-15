import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000
  },
  envDir: './',
  server: {
    host: true,   // listen on 0.0.0.0 so ALB can connect
    port: 5173,   // matches your target group
    strictPort: true
  }
})
