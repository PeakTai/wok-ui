import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      outputDir: 'types',
      include: ['lib/*.ts', 'lib/**/*.ts'],
      // exclude: ['src/ignore'],
      cleanVueFileName: false,
      insertTypesEntry: false,
      rollupTypes: false
    })
  ],
  publicDir: '',
  build: {
    minify: true,
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'wokUI',
      fileName: format => `wok-ui.${format}.js`
    }
  }
})
