import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Changes development port from 5173 to 3000
    open: true, // Automatically opens the app in your browser on start
  }
})
