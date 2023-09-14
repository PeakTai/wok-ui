import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/wok-ui/',
  build: {
    minify: true,
    outDir: path.resolve(__dirname, 'docs')
  }
})
