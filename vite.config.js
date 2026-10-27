import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // أضفنا هذا السطر

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // هذا السطر يخبر Vite أن @ تعني مجلد src
    },
  },
})