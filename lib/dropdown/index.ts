import { DivModule, Module, SubModulesOpt, buildSubModules, createDomModule } from '../module'
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
  menu: DropdownMenuItem[] | Module
  /**
   * 内容
   */
  content: SubModulesOpt
}
/**
 * 下拉框
 */
export class Dropdown extends DivModule {
  private closeListener?: (ev: MouseEvent) => void
  constructor(opts: DropdownOpts) {
    super('wok-ui-dropdown')
    // 下拉触发
    // 点击处理
    this.el.addEventListener('click', ev => {
      if (this.el.classList.contains('open')) {
        // 关闭
        this.unbindClose()
      } else {
        // 打开
        this.el.classList.add('open')
        setTimeout(() => {
          this.closeListener = ev => {
            const target = ev.currentTarget as HTMLElement
            if (this.el.contains(target)) {
              return
            }
            // 关闭
            if (this.el.classList.contains('open')) {
              this.unbindClose()
            }
          }
          document.addEventListener('click', this.closeListener)
        }, 0)
      }
    })
    // 内容
    this.addChild(...buildSubModules(opts.content))
    // 菜单
    if (Array.isArray(opts.menu)) {
      this.addChild(
        createDomModule({
          classNames: ['wok-ui-dropdown-menu'],
          onClick(ev) {
            ev.stopPropagation()
          },
          children: opts.menu.map(item =>
            createDomModule({
              classNames: ['wok-ui-dropdown-item', item.disabled ? 'disabled' : ''],
              innerText: item.label,
              onClick: ev => {
                if (item.disabled) {
                  return
                }
                this.unbindClose()
                if (item.callback) item.callback()
              }
            })
          )
        })
      )
    } else {
      this.addChild(
        createDomModule({
          classNames: ['wok-ui-dropdown-menu'],
          onClick(ev) {
            ev.stopPropagation()
          },
          children: [opts.menu]
        })
      )
    }
  }

  private unbindClose() {
    this.el.classList.remove('open')
    if (this.closeListener) document.removeEventListener('click', this.closeListener)
  }

  destroy(): void {
    if (this.closeListener) {
      document.removeEventListener('click', this.closeListener)
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
