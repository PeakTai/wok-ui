import path from 'node:path'
import type { MdFragment } from './parser.js'
import type { PageEntry } from './virtual-html.js'

/**
 * 转义 markdown 文本，使其可安全放入模板字符串 \`...\` 中
 */
function escapeTemplateLiteral(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

/**
 * 根据 fragments 生成 wok-ui Page 组件代码。
 *
 * @param fragments  解析后的 markdown/demo 片段数组
 * @param activePage 当前激活的页面名称（不含语言前缀）
 * @param lang       当前页面所属语言
 * @param allPages   全部语言的所有页面，用于 sidebar 过滤和语言切换
 * @param mdAbsPath  当前 .md 文件绝对路径，用于计算到站点源码的相对导入
 * @param siteRoot   docs-site 根目录（含 src/ 与 markdown.ts）
 */
export function generateCode(
  fragments: MdFragment[],
  activePage: string,
  lang: string,
  allPages: PageEntry[],
  mdAbsPath: string,
  siteRoot: string,
): string {
  const demoImports: string[] = []
  const contentItems: string[] = []
  let demoIndex = 0

  for (const frag of fragments) {
    if (typeof frag === 'string') {
      contentItems.push(`new Markdown(\`${escapeTemplateLiteral(frag)}\`)`)
    } else {
      demoIndex++
      demoImports.push(`import Demo${demoIndex} from "${frag.path}"`)
      // 包一层 docs-demo 容器，统一控制 demo 与上下内容的间距
      contentItems.push(
        `() => { const wrap = new DivModule('docs-demo'); wrap.addChild(new Demo${demoIndex}()); return wrap }`
      )
    }
  }

  const importBlock = demoImports.join('\n')
  const contentBlock = contentItems.map(item => `      ${item}`).join(',\n')

  // 站点源码相对当前 .md 文件的位置（兼容任意页面层级），替代 @docs 别名
  const mdDir = path.dirname(mdAbsPath)
  const toRel = (abs: string): string => {
    let rel = path.relative(mdDir, abs).split(path.sep).join('/')
    if (!rel.startsWith('.')) rel = './' + rel
    return rel
  }
  const srcDir = path.resolve(siteRoot, 'src')
  const i18nRel = toRel(path.resolve(srcDir, 'i18n'))
  const layoutRel = toRel(path.resolve(srcDir, 'layout'))
  const markdownRel = toRel(path.resolve(siteRoot, 'markdown.ts'))
  // wok-ui-ext 包 exports 未暴露 dist/global.css，直接用相对路径指向其产物文件
  const globalCssRel = toRel(path.resolve(siteRoot, 'node_modules/wok-ui-ext/dist/global.css'))

  // 全部语言的页面数据，每个条目包含 lang 字段
  const pagesJson = JSON.stringify(allPages.map(p => ({
    name: p.name,
    path: p.lang + '/' + p.name + '.html',
    title: p.meta.title,
    lang: p.lang,
    order: p.meta.order,
    description: p.meta.description,
    icon: p.meta.icon,
    category: p.meta.category,
  })))

  return `
import '${globalCssRel}'
import { DivModule, getI18n } from 'wok-ui'
import { getWokUiExtI18n } from 'wok-ui-ext'
import { getDocsI18n } from '${i18nRel}'
import {DocsLayout} from '${layoutRel}'
import {Markdown} from '${markdownRel}'
${importBlock}

class Page extends DocsLayout {
  constructor() {
    super({
      lang: '${lang}',
      activePage: '${activePage}',
      pages: ${pagesJson}
    })
  }

  buildMainContent() {
    return [
${contentBlock}
    ]
  }
}

// 初始化 i18n 后再挂载页面，确保 wok-ui 和 lib 的文案已切换为目标语言
(async () => {
  getWokUiExtI18n()
  getDocsI18n()
  await getI18n().setLang('${lang}')
  new Page().mount(document.body)
})()
`
}
