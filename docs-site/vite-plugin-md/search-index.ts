import fs from 'node:fs'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { PageEntry } from './virtual-html.js'

/**
 * 构建期全文搜索索引生成。
 *
 * 输出结构（按语言生成一份）：
 * {
 *   version: 1,
 *   dictionary: [...],   // 中文词典（供运行时 tokenize 最大匹配用）
 *   maxTokenLen: N,      // 词典中最长词的长度
 *   pages: [{ path, title, category, icon, description, content }]
 * }
 *
 * 不直接下发 minisearch 内部索引，而是下发原始文本 + 词典，
 * 由运行时用同一套 tokenize 逻辑重建索引，避免内部格式跨版本不兼容。
 */

/** 中文原子术语种子词表，覆盖常用搜索词。词典 = 种子词 + 各页 title/category 自动收集 */
const SEED_TERMS = [
  '参数', '类型', '默认值', '说明', '禁用', '尺寸', '点击', '事件', '回调', '方法',
  '返回', '状态', '成功', '失败', '警告', '信息', '提示', '确认', '取消', '加载',
  '上传', '下载', '搜索', '编辑', '新增', '删除', '主题', '国际化', '语言', '导航',
  '菜单', '数据', '展示', '录入', '反馈', '通用', '组件', '页面', '文档', '设置',
  '切换', '预览', '缩放', '拖拽', '选中', '悬停', '全屏', '列表', '表单', '表格',
  '树形', '多级', '嵌套', '折叠', '展开', '宽度', '高度', '面板', '内容', '文本',
  '图标', '标题', '按钮', '样式', '背景', '边框', '间距', '位置', '方向', '水平',
  '垂直', '受控', '默认', '自定义', '支持', '显示', '隐藏', '关闭', '打开', '提交',
  '重置', '校验', '占位', '图片', '描述', '操作', '项目', '步骤', '进度', '日期',
  '范围', '时间', '排序', '过滤', '选择', '分组', '对齐', '最大', '最小', '常用',
]

/** 索引中单个页面的结构 */
export interface SearchIndexPage {
  /** 页面文件路径，如 button.html、index.html（相对 /{lang}/） */
  path: string
  title: string
  category?: string
  icon?: string
  description?: string
  /** 页面正文纯文本（已去 frontmatter / 代码块 / markdown 语法） */
  content: string
  /** 围栏代码块文本，仅用于搜索 */
  codes?: string
}

/** 索引文件结构 */
export interface SearchIndexFile {
  version: 1
  dictionary: string[]
  maxTokenLen: number
  pages: SearchIndexPage[]
}

/**
 * 提取 Markdown 正文纯文本：去 frontmatter、去围栏代码块（含 ```demo），
 * 用 marked 转 HTML 后剥离标签与实体，压缩空白。
 * 围栏代码块内容单独收进 codes，供搜索索引使用（权重低，不出现在摘要）。
 */
export function extractPlainText(raw: string): { content: string; codes: string } {
  const { content } = matter(raw)
  const codeParts: string[] = []
  // 去掉所有围栏代码块（``` 开头的），包括 ```demo 引用块，内容收进 codes
  const noFence = content.replace(/```([\s\S]*?)```/g, (_m, code: string) => {
    codeParts.push(code)
    return ' '
  })
  const html = marked.parse(noFence) as string
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
  return {
    content: text.replace(/\s+/g, ' ').trim(),
    codes: codeParts.join(' ').replace(/\s+/g, ' ').trim(),
  }
}

/** 收集中文词（2 字及以上），用于词典构建 */
function collectChineseTerms(text: string): string[] {
  const result = new Set<string>()
  // 连续中文串，按 2+ 字符整体收集（配合 prefix 搜索，短词可命中长词开头）
  const re = /[\u4e00-\u9fff]{2,}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    result.add(m[0])
  }
  return [...result]
}

/**
 * 构建某语言的搜索索引 JSON 字符串。
 * @param pages 该语言的全部页面
 */
export function buildSearchIndex(pages: PageEntry[]): string {
  const dictionary = new Set<string>(SEED_TERMS)

  const indexPages: SearchIndexPage[] = pages.map(p => {
    const raw = fs.readFileSync(p.absPath, 'utf-8')
    // title / category 自动进词典，保证整名可被搜索（prefix 匹配短词前缀）
    if (p.meta.title) collectChineseTerms(p.meta.title).forEach(t => dictionary.add(t))
    if (p.meta.category) collectChineseTerms(p.meta.category).forEach(t => dictionary.add(t))
    const { content, codes } = extractPlainText(raw)
    return {
      path: p.name + '.html',
      title: p.meta.title || p.name,
      category: p.meta.category,
      icon: p.meta.icon,
      description: p.meta.description,
      content,
      codes,
    }
  })

  const dict = [...dictionary].sort()
  const maxTokenLen = dict.reduce((max, w) => Math.max(max, w.length), 0)

  const file: SearchIndexFile = {
    version: 1,
    dictionary: dict,
    maxTokenLen,
    pages: indexPages,
  }
  return JSON.stringify(file)
}
