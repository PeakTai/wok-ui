// 对话框提示消息，强制用户交互，层级比 loading 低一些
import { Animation } from '../animation'
import { getColor } from '../color'
import { getI18n } from '../i18n'
import { createDomModule } from '../module'
import { Text } from '../text'
import './dialog.less'

export function showAlert(msg: string): Promise<void> {
  return new Promise<void>(res => {
    const dialog = createDomModule({
      classNames: ['wok-ui-dialog-box'],
      children: [
        createDomModule({
          classNames: ['dialog-content', Animation.SLIDE_TOP],
          children: [
            createDomModule({ classNames: ['dialog-body'], innerText: msg }),
            createDomModule({
              classNames: ['dialog-footer'],
              children: [
                createDomModule({
                  innerText: getI18n().buildMsg('confirm'),
                  onClick(ev) {
                    res()
                    dialog.destroy()
                  }
                })
              ]
            })
          ]
        })
      ]
    })
    dialog.mount(document.body)
  })
}
export function showConfirm(msg: string): Promise<boolean> {
  return new Promise<boolean>(res => {
    const dialog = createDomModule({
      classNames: ['wok-ui-dialog-box'],
      children: [
        createDomModule({
          classNames: ['dialog-content', Animation.SLIDE_TOP],
          children: [
            createDomModule({ classNames: ['dialog-body'], innerText: msg }),
            createDomModule({
              classNames: ['dialog-footer'],
              children: [
                createDomModule({
                  innerText: getI18n().buildMsg('cancel'),
                  onClick(ev) {
                    res(false)
                    dialog.destroy()
                  }
                }),
                createDomModule({
                  children: [new Text({ text: getI18n().buildMsg('confirm'), color: getColor().primary })],
                  onClick(ev) {
                    res(true)
                    dialog.destroy()
                  }
                })
              ]
            })
          ]
        })
      ]
    })
    dialog.mount(document.body)
  })
}
