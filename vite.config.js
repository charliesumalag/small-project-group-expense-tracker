import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source maps in production
  },
  server: {
    sourcemap: true, // Ensure source maps are enabled in development
  },
})
