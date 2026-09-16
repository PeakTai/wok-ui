import { DivModule } from "wok-ui"
import { marked, Renderer } from "marked"
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import 'github-markdown-css/github-markdown.css'

// 配置 marked 代码高亮
const renderer = new Renderer()
renderer.code = function (token: { text: string; lang?: string }): string {
  const lang = token.lang || ''
  const code = token.text
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  const highlighted = hljs.highlight(code, { language }).value
  return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
}

marked.setOptions({ renderer })

export class Markdown extends DivModule {
  constructor(content: string) {
    super()
    this.el.classList.add('markdown-body')
    this.el.innerHTML = marked.parse(content) as string
  }
}
