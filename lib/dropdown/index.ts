import {
  ConvertibleModule,
  DivModule,
  SubModulesOpt,
  buildSubModules,
  createDomModule
} from '../module'
import './style.less'

/**
 * 条目
 */
export interface DropdownMenuItem {
  /**
   * 标题
   */
  label: string
  /**
   * 是否显示为禁用状态，禁用状态不会触发回调
   */
  disabled?: boolean
  /**
   * 回调处理
   * @returns
   */
  callback?: () => void
}

export interface DropdownOpts {
  /**
   * 菜单，可以设置条目，也可以通过模块完全自定义内容
   */
  menus: DropdownMenuItem[] | SubModulesOpt
  /**
   * 内容
   */
  content: SubModulesOpt
  /**
   * 菜单对齐方式，默认左对齐(left)
   */
  menusAlign?: 'left' | 'right'
}
/**
 * 下拉框
 */
export class Dropdown extends DivModule {
  /**
   * 监听器删除函数
   */
  private __removeCloseListener?: () => void

  constructor(opts: DropdownOpts) {
    super('wok-ui-dropdown')
    // 下拉触发
    // 点击处理
    this.el.addEventListener('click', ev => {
      if (this.el.classList.contains('open')) {
        // 关闭
        this.close()
      } else {
        // 打开
        this.el.classList.add('open')
        setTimeout(() => this.addCloseListener(), 0)
      }
    })
    // 内容
    this.addChild(...buildSubModules(opts.content))
    const menusAlign = opts.menusAlign || 'left'
    // 菜单，判定类型，再做处理
    // DropdownMenuItem[] 和 SubModulesOpt 很接近，只能依赖于一些特殊的独有属性来区分
    if (
      Array.isArray(opts.menus) &&
      opts.menus[0] &&
      typeof (opts.menus[0] as any).label === 'string'
    ) {
      const menus = opts.menus as DropdownMenuItem[]
      this.addChild({
        classNames: ['wok-ui-dropdown-menu', menusAlign],
        onClick(ev) {
          ev.stopPropagation()
        },
        children: menus.map(item => ({
          classNames: ['wok-ui-dropdown-item', item.disabled ? 'disabled' : ''],
          innerText: item.label,
          onClick: ev => {
            if (item.disabled) {
              return
            }
            this.close()
            if (item.callback) item.callback()
          }
        }))
      })
    } else {
      this.addChild({
        classNames: ['wok-ui-dropdown-menu', menusAlign],
        onClick(ev) {
          ev.stopPropagation()
        },
        children: opts.menus as SubModulesOpt
      })
    }
  }

  private addCloseListener() {
    const closeListener = (ev: Event) => {
      ev.stopPropagation()
      const target = ev.target as HTMLElement
      if (this.el.contains(target)) {
        return
      }
      // 关闭
      if (this.el.classList.contains('open')) {
        this.close()
      }
    }
    let parent = this.el.parentElement
    let parentList: HTMLElement[] = []
    while (parent) {
      parentList.push(parent)
      parent.addEventListener('click', closeListener)
      parent = parent.parentElement
    }
    this.__removeCloseListener = () =>
      parentList.forEach(p => p.removeEventListener('click', closeListener))
  }

  private close() {
    this.el.classList.remove('open')
    if (this.__removeCloseListener) {
      this.__removeCloseListener()
      this.__removeCloseListener = undefined
      return
    }
  }

  destroy(): void {
    if (this.__removeCloseListener) {
      this.__removeCloseListener()
    }
    super.destroy()
  }
}
/**
 * 上拉框
 */
export class Dropup extends Dropdown {
  constructor(opts: DropdownOpts) {
    super(opts)
    this.el.classList.add('dropup')
  }
}
