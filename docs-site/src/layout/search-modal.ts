import MiniSearch from 'minisearch'
import { createDomModule, FullRenderingModule, type ConvertibleModule } from 'wok-ui'
import { showModal } from 'wok-ui-ext'
import { getDocsI18n } from '../i18n'
import { FontAwesomeIcon, type FontAwesomeIconClass } from './font-awesome'

/**
 * 文档站全文搜索弹窗。
 *
 * 索引在构建期生成（vite-plugin-md/search-index.ts），以 JSON 形式与页面一同发布，
 * 运行时按语言懒加载并重建 minisearch 索引，输入即搜。
 *
 * 中文分词：基于构建期生成的词典做正向最大匹配，词表外中文不产生 token；
 * 搜索开启 prefix，短词可命中以它开头的长词（如"日期"命中"日期选择器"）。
 */

interface SearchIndexPage {
  path: string
  title: string
  category?: string
  icon?: string
  description?: string
  content: string
  codes?: string
}

interface SearchIndexFile {
  version: 1
  dictionary: string[]
  maxTokenLen: number
  pages: SearchIndexPage[]
}

interface SearchEngine {
  index: SearchIndexFile
  ms: MiniSearch
}

interface Hit {
  path: string
  terms: string[]
}

type DocsI18n = ReturnType<typeof getDocsI18n>

let engineCache: { lang: string; engine: Promise<SearchEngine> } | undefined

/**
 * 懒加载指定语言的搜索索引（带缓存）。
 * 使用相对路径，兼容部署到子路径（如 GitHub Pages /wok-ui-ext/）。
 */
async function getEngine(lang: string): Promise<SearchEngine> {
  if (engineCache && engineCache.lang === lang) return engineCache.engine
  const promise = loadEngine()
  engineCache = { lang, engine: promise }
  return promise
}

async function loadEngine(): Promise<SearchEngine> {
  const res = await fetch('./search-index.json')
  if (!res.ok) throw new Error(`search index not found: ${res.status}`)
  const index = (await res.json()) as SearchIndexFile
  const tokenize = makeTokenizer(new Set(index.dictionary), index.maxTokenLen)
  const ms = new MiniSearch({
    fields: ['title', 'category', 'description', 'content', 'codes'],
    idField: 'path',
    tokenize,
    processTerm: t => t.toLowerCase(),
    searchOptions: {
      boost: { title: 3, category: 2, description: 2, content: 1, codes: 1.5 },
      prefix: true,
    },
  })
  ms.addAll(index.pages)
  return { index, ms }
}

/**
 * 创建中文词典最大匹配的 tokenize 函数：
 * 英文/数字/连字符按正则切分；中文部分按词典贪心匹配最长词，未命中字符跳过。
 */
function makeTokenizer(dict: Set<string>, maxLen: number): (text: string) => string[] {
  return (text: string) => {
    const tokens: string[] = []
    const eng = text.match(/[a-zA-Z0-9_-]+/g)
    if (eng) tokens.push(...eng)
    for (const seg of text.split(/[^\u4e00-\u9fff]+/)) {
      if (!seg) continue
      let i = 0
      while (i < seg.length) {
        let hit = false
        const lim = Math.min(maxLen, seg.length - i)
        for (let len = lim; len >= 2; len--) {
          const word = seg.slice(i, i + len)
          if (dict.has(word)) {
            tokens.push(word)
            i += len
            hit = true
            break
          }
        }
        if (!hit) i++
      }
    }
    return tokens
  }
}

/** 生成命中摘要：取第一个命中词前后各 radius 个字符，超出部分加省略号 */
function makeSnippet(content: string, terms: string[], radius = 30): string {
  const lower = content.toLowerCase()
  let first = -1
  let firstTerm = ''
  for (const t of terms) {
    const i = lower.indexOf(t.toLowerCase())
    if (i !== -1 && (first === -1 || i < first)) {
      first = i
      firstTerm = t
    }
  }
  if (first === -1) return content.slice(0, radius * 2)
  const start = Math.max(0, first - radius)
  const end = Math.min(content.length, first + firstTerm.length + radius)
  return (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '')
}

/** 将文本按命中词切成 [普通文本, <em>命中</em>, ...]，重叠区间合并，大小写不敏感 */
function highlightParts(text: string, terms: string[]): ConvertibleModule[] {
  const ranges: Array<[number, number]> = []
  const lower = text.toLowerCase()
  for (const t of terms) {
    const q = t.toLowerCase()
    if (!q) continue
    let idx = lower.indexOf(q)
    while (idx !== -1) {
      ranges.push([idx, idx + q.length])
      idx = lower.indexOf(q, idx + q.length)
    }
  }
  if (!ranges.length) return [text]
  ranges.sort((a, b) => a[0] - b[0])
  const merged: Array<[number, number]> = [ranges[0]]
  for (let k = 1; k < ranges.length; k++) {
    const last = merged[merged.length - 1]
    const cur = ranges[k]
    if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1])
    else merged.push(cur)
  }
  const parts: ConvertibleModule[] = []
  let cursor = 0
  for (const [s, e] of merged) {
    if (s > cursor) parts.push(text.slice(cursor, s))
    parts.push({ tag: 'em', classNames: 'docs-search-hit', children: text.slice(s, e) })
    cursor = e
  }
  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts
}

/**
 * 搜索结果列表模块。
 *
 * 使用 FullRenderingModule 将结果渲染封装在模块内部，
 * 外部不直接操作 DOM，数据变化时调用 render() 全量刷新。
 */
class SearchResultsModule extends FullRenderingModule {
  private query = ''
  private results: Hit[] = []
  private activeIndex = -1

  constructor(
    private engine: SearchEngine,
    private i18n: DocsI18n,
    private onGo: (path: string) => void,
  ) {
    super('docs-search-results')
    this.search('')
  }

  /** 执行搜索并刷新列表 */
  search(query: string) {
    const q = query.trim()
    this.query = q
    if (!q) {
      this.results = []
      this.activeIndex = -1
    } else {
      this.results = this.engine.ms
        .search(q)
        .slice(0, 20)
        .map(h => ({ path: h.id, terms: h.terms }))
      this.activeIndex = this.results.length ? 0 : -1
    }
    this.render()
  }

  /** 上下移动激活项 */
  moveActive(step: number) {
    if (!this.results.length) return
    this.activeIndex = (this.activeIndex + step + this.results.length) % this.results.length
    this.render()
  }

  /** 打开当前激活项 */
  goActive() {
    const cur = this.results[this.activeIndex]
    if (cur) this.onGo(cur.path)
  }

  protected buildContent(): void {
    if (!this.results.length) {
      this.addChild({
        classNames: 'docs-search-empty',
        innerText: this.query
          ? this.i18n.buildMsg('docs-search-empty')
          : this.i18n.buildMsg('docs-search-empty-hint'),
      })
      return
    }
    // 高亮词用首个结果的命中 terms，同一查询下各结果 terms 一致
    const terms = this.results[0].terms.length
      ? this.results[0].terms
      : this.query.split(/\s+/).filter(Boolean)
    for (let i = 0; i < this.results.length; i++) {
      const r = this.results[i]
      const page = this.engine.index.pages.find(p => p.path === r.path)
      if (!page) continue
      this.addChild({
        classNames: ['docs-search-item', i === this.activeIndex && 'active'].filter(Boolean) as string[],
        onClick: () => this.onGo(page.path),
        children: add => {
          add({
            tag: 'div',
            classNames: 'docs-search-item-title',
            children: add => {
              if (page.icon) {
                add(new FontAwesomeIcon({ iconClass: page.icon as FontAwesomeIconClass }), ' ')
              }
              add(...highlightParts(page.title, terms))
            },
          })
          add({
            tag: 'div',
            classNames: 'docs-search-item-meta',
            children: add => {
              if (page.category) {
                add({ tag: 'span', classNames: 'docs-search-item-cat', innerText: page.category })
              }
              add({
                tag: 'span',
                classNames: 'docs-search-item-snippet',
                children: highlightParts(makeSnippet(page.content, terms), terms),
              })
            },
          })
        },
      })
    }
  }
}

/** 打开搜索弹窗 */
export async function openSearchModal(lang: string): Promise<void> {
  const i18n = getDocsI18n()
  let engine: SearchEngine
  try {
    engine = await getEngine(lang)
  } catch {
    // 索引加载失败（dev 未启动插件等）时静默关闭，避免空白弹窗
    return
  }

  const go = (path: string) => {
    location.href = path
  }

  const resultsModule = new SearchResultsModule(engine, i18n, go)

  showModal({
    title: i18n.buildMsg('docs-search-modal-title'),
    width: 620,
    body: createDomModule({
      classNames: 'docs-search-panel',
      children: add => {
        add({
          tag: 'input',
          classNames: 'docs-search-input',
          attrs: {
            placeholder: i18n.buildMsg('docs-search-modal-placeholder'),
            autocomplete: 'off',
          },
          events: {
            input: e => resultsModule.search((e.target as HTMLInputElement).value),
            keydown: (e: Event) => {
              const ke = e as KeyboardEvent
              if (ke.isComposing) return
              if (ke.key === 'ArrowDown') {
                ke.preventDefault()
                resultsModule.moveActive(1)
              } else if (ke.key === 'ArrowUp') {
                ke.preventDefault()
                resultsModule.moveActive(-1)
              } else if (ke.key === 'Enter') {
                resultsModule.goActive()
              }
            },
          },
          postHandle: el => {
            // Modal 入场动画完成后聚焦输入框
            setTimeout(() => (el as HTMLInputElement).focus(), 120)
          },
        })
        add(resultsModule)
        add({
          tag: 'div',
          classNames: 'docs-search-hint',
          innerText: i18n.buildMsg('docs-search-hint'),
        })
      },
    }),
  })
}

/** 注册全局快捷键 Cmd/Ctrl+K 打开搜索 */
export function registerSearchShortcut(getLang: () => string): void {
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      void openSearchModal(getLang())
    }
  })
}
