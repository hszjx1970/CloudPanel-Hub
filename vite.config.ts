import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for Electron compatibility
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000, // Standard port for dev server
  }
})