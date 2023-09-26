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
    outDir: "cloud-5",
    sourcemap: true,
    commonjsOptions: {
      include: [
        /strudel/, 
        /node_modules/
      ],
    },
    rollupOptions: {
      input: {
        main: '/vite_index.html'
      },
    },
  },
})

