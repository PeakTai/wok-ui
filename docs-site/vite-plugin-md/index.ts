import { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { parseFragments } from './parser.js'
import { generateCode } from './generator.js'
import { DEFAULT_LANG, htmlShell, scanMdPages, type PageEntry } from './virtual-html.js'
import { buildSearchIndex } from './search-index.js'

/**
 * mdToPagePlugin - 将 Markdown 文件自动转换为多语言文档站点的 Vite 插件。
 *
 * ## 功能概述
 *
 * 该插件扫描项目 `pages/` 目录下各语言子目录（如 `zh-CN/`、`en/`）的所有 .md 文件，
 * 将其转换为带导航侧边栏和顶部 Header 的文档页面。
 * 每个 .md 文件对应一个独立页面，支持 frontmatter 元信息（title/order/description）和
 * 内嵌的 ```demo 代码示例块。
 *
 * ## 目录结构
 *
 * ```
 *   pages/
 *     zh-CN/           ← 默认语言
 *       index.md
 *       button/index.md
 *     en/
 *       index.md
 * ```
 *
 * ## 构建流程
 *
 * ```
 *   config() 钩子
 *     │
 *     ├─ 1. scanMdPages(root) 扫描 pages/ 下各语言子目录
 *     │      收集所有 .md 文件，提取 frontmatter + lang 生成 PageEntry 列表
 *     │
 *     ├─ 2. 将 .md 文件作为 rollup 入口（扁平 key）
 *     │      确保 Rollup 为每个页面单独打包为 JS chunk
 *     │
 *     ▼
 *   load() 钩子                 ← 拦截 .md 文件
 *     │
 *     ├─ gray-matter 解析 frontmatter
 *     ├─ parseFragments() 按 ```demo 块拆分
 *     ├─ 从 allPages 中匹配当前页的 lang 和 name
 *     └─ generateCode() 注入 lang + 全部语言 pages，
 *            DocsLayout 内部按 lang 过滤 sidebar，支持语言切换
 *     │
 *     ▼
 *   writeBundle() 钩子           ← JS 写入磁盘后
 *     │
 *     └─ 为每个页面生成 HTML 文件到输出目录的子目录中
 *           （如 dist/zh-CN/index.html, dist/zh-CN/button.html）
 *     │
 *     ▼
 *   configureServer() 钩子      ← 开发服务器中间件
 *     │
 *     ├─ /                      → 302 重定向到 /zh-CN/index.html
 *     └─ /{lang}/{name}.html    → 渲染对应语言页面的 HTML shell
 *           浏览器解析后会再次进入 load()，将 .md 转换为组件代码
 * ```
 *
 * ## 页面 URL 规则
 *
 * - /zh-CN/index.html  → pages/zh-CN/index.md
 * - /zh-CN/button.html → pages/zh-CN/button/index.md
 * - /en/index.html     → pages/en/index.md
 * - /                  → 302 → /zh-CN/index.html（默认中文）
 */
export function mdToPagePlugin(): Plugin {
  let allPages: PageEntry[] = []
  let outDir = ''
  /** 站点根目录（config 钩子时确定，用于计算页面到站点源码的相对导入） */
  let siteRoot = process.cwd()
  /** 站点 base（如 /wok-ui-ext/），configResolved 时从 vite 配置读取 */
  let siteBase = '/'
  /** 各语言的搜索索引 JSON（构建期生成，dev/build 共用） */
  const searchIndexByLang = new Map<string, string>()

  return {
    name: 'md-to-page',

    /**
     * configResolved 钩子：读取最终的 base 配置，
     * 生成 HTML 时用于拼接 script src、静态资源等绝对路径。
     */
    configResolved(config) {
      siteBase = config.base || '/'
    },

    /**
     * config 钩子：在 Vite 解析配置阶段执行。
     * 1. 扫描 pages/ 下各语言子目录的所有 .md 文件，收集页面元信息。
     * 2. 将 .md 文件直接作为 rollup entry（扁平 key），
     *    确保 Rollup 为每个页面单独打包为 JS chunk。
     */
    config(_config, env) {
      const root = _config.root || process.cwd()
      siteRoot = root
      allPages = scanMdPages(root)
      console.log(`[md-plugin] pages: ${allPages.map(p => `${p.lang}/${p.name}(${p.meta.title})`).join(', ') || '(none)'}`)

      // 按语言构建搜索索引（dev 的 configureServer 与 build 的 writeBundle 共用）
      searchIndexByLang.clear()
      const byLang = new Map<string, PageEntry[]>()
      for (const p of allPages) {
        const list = byLang.get(p.lang)
        if (list) list.push(p)
        else byLang.set(p.lang, [p])
      }
      byLang.forEach((pages, lang) => {
        searchIndexByLang.set(lang, buildSearchIndex(pages))
      })

      const input: Record<string, string> = {}
      for (const p of allPages) {
        input[p.flatKey] = p.absPath
      }

      // 记录输出目录（writeBundle 时需写入 HTML 文件）
      // _config.build?.outDir 可能为相对路径，解析为绝对路径
      const configOutDir = _config.build?.outDir as string | undefined
      outDir = configOutDir ? path.resolve(root, configOutDir) : path.resolve(root, 'dist')

      // 构建时才注入 rollup input（开发模式下由 configureServer 处理）
      if (env.command === 'build') {
        return {
          build: {
            rollupOptions: { input },
          },
        }
      }
    },

    /**
     * load 钩子：加载 .md 文件。
     * 将其转换为包含 DocsLayout（Header + 侧边栏导航 + 内容区）的完整页面组件代码。
     */
    load(id) {
      if (!id.endsWith('.md')) return null

      const raw = fs.readFileSync(id, 'utf-8')
      const { content } = matter(raw)
      const fragments = parseFragments(content)
      const entry = allPages.find(p => p.absPath === id)
      const activePage = entry?.name || ''
      const lang = entry?.lang || DEFAULT_LANG
      return generateCode(fragments, activePage, lang, allPages, id, siteRoot)
    },

    /**
     * writeBundle 钩子：构建完成后写入 HTML 文件。
     * 为每个页面生成 HTML，写到输出目录下的子目录中。
     */
    writeBundle(_opts, bundle) {
      if (!allPages.length || !outDir) return

      for (const entry of allPages) {
        // 找到该页面对应的 JS chunk
        for (const [, chunk] of Object.entries(bundle)) {
          if (chunk.type === 'chunk' && chunk.name === entry.flatKey) {
            // script src 使用以 base 开头的绝对路径（如 /wok-ui-ext/assets/xxx.js）
            // chunk.fileName 如 "assets/zh-CN_index-[hash].js"
            const scriptSrc = siteBase + chunk.fileName

            // 收集该入口静态 import 闭包内所有 chunk 的 CSS 产物，在 HTML 中显式引用；
            // 动态 import 的 chunk 其 CSS 由运行时自行注入，无需处理。
            // 注意：vite 8（rolldown）在手动生成 HTML 时不会填充 chunk.viteMetadata.importedCss，
            // 因此通过 css asset 的命名关联（asset.names[0] 为 "<chunk名>.css"）来匹配。
            const chunkNames = new Set<string>()
            const visited = new Set<string>()
            const collectChunks = (name: string): void => {
              const c = bundle[name]
              if (!c || c.type !== 'chunk' || visited.has(name)) return
              visited.add(name)
              chunkNames.add(c.name)
              for (const imp of c.imports ?? []) collectChunks(imp)
            }
            collectChunks(chunk.fileName)

            const cssFiles: string[] = []
            for (const [, out] of Object.entries(bundle)) {
              if (out.type !== 'asset' || !out.fileName.endsWith('.css')) continue
              const base = (out as { names?: string[] }).names?.[0]?.replace(/\.css$/, '')
              if (base && chunkNames.has(base)) cssFiles.push(out.fileName)
            }

            const styleHrefs = cssFiles.map(css => siteBase + css)
            const html = htmlShell(entry, scriptSrc, siteBase, styleHrefs)

            // 写入到输出目录的子目录: dist/zh-CN/index.html
            const htmlDir = path.join(outDir, entry.lang)
            const htmlPath = path.join(htmlDir, entry.name + '.html')
            fs.mkdirSync(htmlDir, { recursive: true })
            fs.writeFileSync(htmlPath, html, 'utf-8')
            console.log(`[md-plugin] emitted ${entry.lang}/${entry.name}.html → ${scriptSrc}`)
            break
          }
        }
      }

      // 在根目录生成 index.html，重定向到默认语言首页
      // 避免静态托管时访问 / 返回 404
      const redirectHtml = `<!DOCTYPE html>
<html lang="${DEFAULT_LANG}">
<head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=${siteBase}${DEFAULT_LANG}/index.html"><title>wok-ui-ext</title></head>
<body>
<a href="${siteBase}${DEFAULT_LANG}/index.html">wok-ui-ext</a>
</body>
</html>`
      fs.writeFileSync(path.join(outDir, 'index.html'), redirectHtml, 'utf-8')
      console.log(`[md-plugin] emitted index.html → redirect to ${siteBase}${DEFAULT_LANG}/index.html`)

      // 输出各语言的搜索索引：dist/{lang}/search-index.json
      searchIndexByLang.forEach((json, lang) => {
        const indexDir = path.join(outDir, lang)
        fs.mkdirSync(indexDir, { recursive: true })
        fs.writeFileSync(path.join(indexDir, 'search-index.json'), json, 'utf-8')
        console.log(`[md-plugin] emitted ${lang}/search-index.json (${json.length} bytes)`)
      })
    },

    /**
     * configureServer 钩子：在开发服务器启动时注册中间件。
     *
     * 拦截 HTTP 请求，将 URL 映射到对应的文档页面：
     * - /                       → 302 重定向到 /zh-CN/index.html
     * - /{lang}/{name}.html     → 渲染对应语言页面的 HTML shell
     *
     * HTML shell 中的 <script type="module" src="xxx.md"> 会再次进入 load()，
     * 将 .md 文件编译为完整的页面组件代码。
     */
    configureServer(server) {
      /**
       * 根据语言和页面名称返回对应的 HTML 文档。
       * @returns 找到并响应返回 true，未找到返回 false
       */
      function servePage(lang: string, name: string, res: any): boolean {
        const entry = allPages.find(p => p.lang === lang && p.name === name)
        if (!entry) return false
        // 开发模式下 script src 指向 .md 源文件（需带 base 前缀，由 Vite 转译）
        const scriptSrc = siteBase + entry.relPath.slice(1)
        res.setHeader('Content-Type', 'text/html')
        res.end(htmlShell(entry, scriptSrc, siteBase))
        return true
      }

      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url!, `http://${req.headers.host}`)
        // dev/build 统一使用 base（如 /wok-ui-ext/）：
        // 仅剥离 pathname 用于本中间件匹配；不改写 req.url，
        // 前缀剥离统一交给 Vite 的 baseMiddleware 处理（public/模块请求）
        const pathname = siteBase !== '/' && url.pathname.startsWith(siteBase)
          ? url.pathname.slice(siteBase.length - 1)
          : url.pathname

        // 搜索索引 → 返回对应语言构建期的索引 JSON
        const indexMatch = pathname.match(/^\/([^/]+)\/search-index\.json$/)
        if (indexMatch) {
          const json = searchIndexByLang.get(indexMatch[1])
          if (json) {
            res.setHeader('Content-Type', 'application/json')
            res.end(json)
            return
          }
          res.writeHead(404)
          res.end()
          return
        }

        // 根路径 / base 根路径 → 302 重定向到默认语言首页
        if (
          pathname === '/' ||
          pathname === '/index.html' ||
          pathname === siteBase.slice(0, -1)
        ) {
          res.writeHead(302, { Location: `${siteBase}${DEFAULT_LANG}/index.html` })
          res.end()
          return
        }

        // /{lang}/{name}.html → 匹配对应文档页面
        const htmlMatch = pathname.match(/^\/([^/]+)\/(.+)\.html$/)
        if (!htmlMatch) return next()

        const lang = htmlMatch[1]
        const name = htmlMatch[2]
        if (servePage(lang, name, res)) return
        next()
      })
    },
  }
}
