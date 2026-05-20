import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import obfuscator from 'vite-plugin-javascript-obfuscator'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 2. plugins 배열에서 삭제
    /* obfuscator({
      options: { ... },
      apply: 'build',
    }), 
    */
  ],
})

/*
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    obfuscator({
      options: {
        controlFlowFlattening: true,
        stringArray: true,
        rotateStringArray: true,
        selfDefending: true,
      },
      apply: 'build',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 1. SCSS/CSS 관련 설정은 여기서 합니다.
  css: {
    preprocessorOptions: {
      scss: {
        outputStyle: 'compressed', // SCSS 자체를 압축해서 컴파일
      },
    },
  },

  build: {
    sourcemap: false,
    minify: 'terser',
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      // 기존 output: { ... } 부분을 format: { ... } 으로 변경했습니다.
      format: {
        comments: false, // 주석 제거
      },
    },
  },
})
*/
