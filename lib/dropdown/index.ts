import { DivModule, SubModulesOpt, buildSubModules, createDomModule } from '../module'
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
  #closeListener?: (ev: MouseEvent) => void
  constructor(opts: DropdownOpts) {
    super('wok-ui-dropdown')
    // 下拉触发
    // 点击处理
    this.el.addEventListener('click', ev => {
      if (this.el.classList.contains('open')) {
        // 关闭
        this.#close()
      } else {
        // 打开
        this.el.classList.add('open')
        setTimeout(() => {
          this.#closeListener = ev => {
            const target = ev.currentTarget as HTMLElement
            if (this.el.contains(target)) {
              return
            }
            // 关闭
            if (this.el.classList.contains('open')) {
              this.#close()
            }
          }
          document.addEventListener('click', this.#closeListener)
        }, 0)
      }
    })
    // 内容
    this.addChild(...buildSubModules(opts.content))
    const menusAlign = opts.menusAlign || 'left'
    // 菜单
    if (Array.isArray(opts.menus)) {
      this.addChild(
        createDomModule({
          classNames: ['wok-ui-dropdown-menu', menusAlign],
          onClick(ev) {
            ev.stopPropagation()
          },
          children: opts.menus.map(item =>
            createDomModule({
              classNames: ['wok-ui-dropdown-item', item.disabled ? 'disabled' : ''],
              innerText: item.label,
              onClick: ev => {
                if (item.disabled) {
                  return
                }
                this.#close()
                if (item.callback) item.callback()
              }
            })
          )
        })
      )
    } else {
      this.addChild(
        createDomModule({
          classNames: ['wok-ui-dropdown-menu', menusAlign],
          onClick(ev) {
            ev.stopPropagation()
          },
          children: opts.menus
        })
      )
    }
  }

  #close() {
    this.el.classList.remove('open')
    if (this.#closeListener) {
      document.removeEventListener('click', this.#closeListener)
    }
  }

  destroy(): void {
    if (this.#closeListener) {
      document.removeEventListener('click', this.#closeListener)
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
