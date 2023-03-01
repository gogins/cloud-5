// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['strudel'],
  },
  build: {
    commonjsOptions: {
      include: [
        /strudel/, 
        /node_modules/
      ],
    },
    rollupOptions: {
      external: [
        /^node:.*/,
      ]
      input: {
        main: '/vite_index.html'
      },
    },
  },
})

