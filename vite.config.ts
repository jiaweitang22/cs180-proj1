import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cs180-proj1/',
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
});
