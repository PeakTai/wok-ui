// ---- 类型定义 ----

export interface DemoFragment {
  type: 'demo'
  /** demo 源码文件的路径 */
  path: string
}

export type MarkdownFragment = string

export type MdFragment = MarkdownFragment | DemoFragment

// ---- 解析逻辑 ----

/**
 * 解析 Markdown 原始文本，按 ```demo 块拆分为片段数组。
 * demo 块解析为 DemoFragment（含 path），其余部分保持为纯文本。
 *
 * 语法：
 *   ```demo path/to/demo.ts
 *   ```
 */
export function parseFragments(raw: string): MdFragment[] {
  const fragments: MdFragment[] = []
  const re = /^```demo\s+(\S+)[\s\S]*?^```/gm
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(raw)) !== null) {
    // match 之前的 Markdown 文本
    const before = raw.slice(lastIndex, match.index).trim()
    if (before) {
      fragments.push(before)
    }

    // demo 片段
    fragments.push({ type: 'demo', path: match[1] })

    lastIndex = match.index + match[0].length
  }

  // 最后一个 demo 块之后的 Markdown 文本
  const after = raw.slice(lastIndex).trim()
  if (after) {
    fragments.push(after)
  }

  return fragments
}
