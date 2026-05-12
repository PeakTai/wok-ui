# 搜索框实现完整示例

style.less

```less
.search-box {
  .wok-ui-input {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    & > .fas {
      color: var(--text-muted);
      pointer-events: none;
      flex-shrink: 0;
    }

    & > input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      appearance: none;
      line-height: 1.5;
      font-size: var(--font-size-body) !important;
      &::placeholder {
        color: var(--text-placeholder);
      }
    }
  }
}
```

index.ts

```typescript
import { DivModule } from 'wok-ui'
import './style.less'

/**
 * 搜索框
 */
export class SearchBox extends DivModule {
  /**
   * 搜索框
   * @param opts
   * @param opts.placeholder 搜索框占位符
   * @param opts.maxLength 搜索框最大长度
   * @param opts.value 搜索框默认值
   * @param opts.onSearch 触发搜索回调
   */
  constructor(opts: {
    placeholder?: string
    maxLength?: number
    value?: string
    /**
     * 触发搜索
     * @param value
     * @returns
     */
    onSearch?: (value: string) => void
  }) {
    super('search-box')
    let value = opts.value || ''
    this.addChild({
      tag: 'form',
      events: {
        submit: (e: Event) => {
          e.preventDefault()
          if (!opts.onSearch) return
          const fValue = value.trim()
          opts.onSearch(fValue)
        }
      },
      children: {
        classNames: 'wok-ui-input',
        tag: 'input',
        attrs: {
          type: 'search',
          placeholder: opts.placeholder,
          maxLength: typeof opts.maxLength === 'number' ? `${opts.maxLength}` : '',
          value
        },
        preHandle(el) {
          const input = el as HTMLInputElement
          input.addEventListener('input', () => {
            value = input.value
          })
          // input[type="search"]在部分浏览器中还会支持 search事件。当用户点击清除图标时，也会触发这个事件
          input.addEventListener('search', evt => {
            if (input.value === '') {
              opts.onSearch?.('')
            }
          })
        }
      }
    })
  }
}
```
