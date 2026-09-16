// vite.config.ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { mdToPagePlugin } from './vite-plugin-md/index.js'

// 项目根目录（docs-site/），以及上一级的 wok-ui 源码目录
const siteRoot = fileURLToPath(new URL('.', import.meta.url))
const wokUiRoot = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  base: '/wok-ui/',
  plugins: [mdToPagePlugin()],
  resolve: {
    // 直接引用 wok-ui 源码（lib/），而不是 npm 安装的产物包：
    // 改动 lib/ 立刻热更新，文档站同时也是开发调试与验证的场所
    alias: [{ find: /^wok-ui$/, replacement: wokUiRoot + 'lib/index.ts' }]
  },
  server: {
    fs: {
      // 源码位于 docs-site 之外，需放开开发服务器的文件访问限制
      allow: [siteRoot, wokUiRoot]
    }
  },
  optimizeDeps: {
    // wok-ui-ext 依赖 wok-ui，若被预构建会把别名后的源码内联成另一份实例，
    // 因此不做预构建，让它与文档站共用同一份 lib/ 源码
    exclude: ['wok-ui-ext']
  },
  build: {
    // 产物输出到项目根目录的 docs 目录，便于 GitHub Pages 直接以该目录发布
    outDir: '../docs',
    emptyOutDir: true
  }
})
