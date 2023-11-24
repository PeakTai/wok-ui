import { Checkbox } from '../form'
import { ConvertibleModule } from '../module'

/**
 * 列设定.
 */
export interface TableColumnSetting<T> {
  /**
   * 列名称.特殊需要传入模块来处理，比如文字需要变色等.
   */
  name: ConvertibleModule
  /**
   * 列宽度.
   */
  width?: number
  /**
   * 内容生成.
   */
  content: (data: T, rowIdx: number) => ConvertibleModule | Promise<ConvertibleModule>
}
/**
 * 列.
 */
export class TableColumn<T> {
  constructor(readonly setting: TableColumnSetting<T>) {}
}
/**
 * 勾选框列.
 */
export class TableCheckboxColumn<T> extends TableColumn<T> {
  #checkAllBox?: Checkbox
  #boxes: Checkbox[] = []
  constructor(opts: {
    /**
     * 勾选框绑定的值.
     */
    value: (data: T, rowIdx: number) => string
    /**
     * 初始状态，可选.
     */
    checked?: (data: T, rowIdx: number) => boolean
    /**
     * 列名称，可选，如果有值，则不会在头部显示全选的勾选框.
     */
    name?: string
    /**
     * 更改事件.
     */
    onChange?: (checkedVals: string[]) => void
  }) {
    let checkAllBox: Checkbox | undefined = undefined
    if (!opts.name) {
      checkAllBox = new Checkbox({
        status: 'unchecked',
        onChange: status => {
          if (!checkAllBox) {
            return
          }
          if (checkAllBox.isChecked()) {
            // 全选
            this.#boxes.forEach(b => b.setStatus('checked'))
          } else {
            // 全不选
            this.#boxes.forEach(b => b.setStatus('unchecked'))
          }
          if (opts.onChange) {
            opts.onChange(this.getCheckedValues())
          }
        },
        value: ''
      })
    }
    super({
      name: opts.name || checkAllBox || '',
      content: (data, idx) => {
        const value = opts.value(data, idx)
        const checked = opts.checked ? opts.checked(data, idx) : false
        const box = new Checkbox({
          status: checked ? 'checked' : 'unchecked',
          value,
          onChange: () => {
            const checkedValues = this.getCheckedValues()
            if (opts.onChange) {
              opts.onChange(checkedValues)
            }
            this.#updateCheckAllBox()
          }
        })
        this.#boxes.push(box)
        return box
      },
      width: 30
    })
    this.#checkAllBox = checkAllBox
  }

  /**
   * 更新全选勾选框.
   */
  #updateCheckAllBox() {
    if (!this.#checkAllBox) {
      return
    }
    const checkedValues = this.getCheckedValues()
    if (checkedValues.length === this.#boxes.length) {
      this.#checkAllBox.setStatus('checked')
    } else if (checkedValues.length === 0) {
      this.#checkAllBox.setStatus('unchecked')
    } else {
      this.#checkAllBox.setStatus('indeterminate')
    }
  }

  getCheckedValues(): string[] {
    return this.#boxes.filter(b => b.isChecked()).map(b => b.value)
  }

  checkAll() {
    if (this.#checkAllBox) {
      this.#checkAllBox.setStatus('checked')
    }
    this.#boxes.forEach(b => b.setStatus('checked'))
  }

  uncheckAll() {
    if (this.#checkAllBox) {
      this.#checkAllBox.setStatus('unchecked')
    }
    this.#boxes.forEach(b => b.setStatus('unchecked'))
  }
}

/**
 * 序号列.
 */
export class TableIndexColumn<T> extends TableColumn<T> {
  constructor() {
    super({ name: '#', content: (data, idx) => `${idx + 1}`, width: 30 })
  }
}
