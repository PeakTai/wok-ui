import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import matter from 'gray-matter'

/** 默认语言 */
export const DEFAULT_LANG = 'zh-CN'

export interface PageMeta {
  title: string
  order?: number
  description?: string
  keywords?: string
  icon?: string
  /** 所属分类，用于侧边栏分组。不设置则显示为独立项。 */
  category?: string
}

export interface PageEntry {
  /** 页面名称（不含语言前缀），如 index、button */
  name: string
  /** 所属语言，如 zh-CN、en */
  lang: string
  /** 扁平 key（不含路径分隔符），用于 rollup input，如 zh-CN_index */
  flatKey: string
  absPath: string
  relPath: string
  meta: PageMeta
}

/**
 * 生成 HTML 骨架。
 * @param entry       页面条目
 * @param scriptSrc   JS chunk 的路径（相对于 HTML 文件的位置）
 * @param base        站点 base（如 /wok-ui/），用于静态资源绝对路径
 * @param stylesheets 该入口静态依赖的 CSS 产物路径列表（带 base 前缀）
 */
export function htmlShell(
  entry: PageEntry,
  scriptSrc: string,
  base = '/',
  stylesheets: string[] = []
): string {
  const desc = entry.meta.description
    ? `<meta name="description" content="${entry.meta.description}">\n  `
    : ''
  const kw = entry.meta.keywords
    ? `<meta name="keywords" content="${entry.meta.keywords}">\n  `
    : ''
  // 页面自身 CSS（构建产物中提取的 .css 文件），需在 HTML 中显式引用，
  // 否则绕过了 Vite 的 HTML 注入导致样式丢失
  const cssLinks = stylesheets
    .map(h => `<link rel="stylesheet" href="${h}">`)
    .join('\n  ')
  return `<!DOCTYPE html>
<html lang="${entry.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="icon" href="${base}favicon.ico">
  ${desc}${kw}${cssLinks ? cssLinks + '\n  ' : ''}<link rel="stylesheet" href="${base}vendor/fontawesome-5.15.4/css/all.min.css">
  <title>${entry.meta.title}</title>
</head>
<body>
<script type="module" src="${scriptSrc}"></script>
</body>
</html>`
}

/**
 * 提取标题：优先 frontmatter.title → 第一个 # 标题 → 文件名
 */
function extractTitle(raw: string, fileName: string): string {
  const { data } = matter(raw)
  if (data.title) return data.title

  const h1Match = raw.match(/^#\s+(.+)$/m)
  if (h1Match) return h1Match[1]

  return fileName
}

/**
 * 递归扫描 src/pages 目录下所有语言的 .md 文件。
 *
 * 目录结构：
 *   src/pages/
 *     zh-CN/           ← 语言目录（目录名即语言标识）
 *       index.md
 *       button/index.md
 *     en/
 *       index.md
 *
 * 子目录下的 index.md 其 page name 为目录名（如 src/pages/zh-CN/button/index.md → name: button）。
 * 菜单保持扁平一层，不嵌套。
 */
export function scanMdPages(root: string): PageEntry[] {
  const pagesDir = path.resolve(root, 'src', 'pages')
  if (!fs.existsSync(pagesDir)) return []

  const entries: PageEntry[] = []

  // 遍历 pages/ 下的一级子目录作为语言目录
  const langDirs = fs.readdirSync(pagesDir).filter(f => {
    const stat = fs.statSync(path.join(pagesDir, f))
    return stat.isDirectory()
  })

  for (const lang of langDirs) {
    const langDir = path.join(pagesDir, lang)
    const files = fg.sync('**/*.md', { cwd: langDir })

    for (const f of files) {
      const absPath = path.resolve(langDir, f)
      const parts = f.split('/')

      // 子目录下的 index.md → 页面名用目录名；否则用文件名
      let name: string
      if (parts.length > 1 && parts[parts.length - 1] === 'index.md') {
        name = parts[parts.length - 2]
      } else {
        name = parts[parts.length - 1].replace(/\.md$/, '')
      }

      const raw = fs.readFileSync(absPath, 'utf-8')
      const { data } = matter(raw)

      entries.push({
        name,
        lang,
        flatKey: `${lang}_${name}`,
        absPath,
        relPath: '/' + path.relative(root, absPath),
        meta: {
          title: data.title || extractTitle(raw, name),
          order: data.order,
          description: data.description,
          keywords: data.keywords,
          icon: data.icon,
          category: data.category,
        },
      })
    }
  }

  return entries
}
