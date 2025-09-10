// 对话框提示消息，强制用户交互，层级比 loading 低一些
import { getI18n } from '../i18n'
import { showModal } from '../modal'
import { SecondaryBodyText } from '../text'

export function showAlert(msg: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const modal = showModal({
      dialogCentered:true,
      width: 400,
      staticBackDrop: true,
      title: `⚠️ ${getI18n().buildMsg('information')}`,
      closeBtn: false,
      body: {
        style: { padding: '0.5rem' },
        children: new SecondaryBodyText(msg)
      },
      buttons: {
        confirm: true
      },
      onConfirm: () => {
        resolve()
        modal.close()
      }
    })
  })
}
export function showConfirm(msg: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const modal = showModal({
      dialogCentered: true,
      width: 400,
      staticBackDrop: true,
      title: `❓ ${getI18n().buildMsg('confirmation')}`,
      closeBtn: false,
      body: {
        style: { padding: '0.5rem' },
        children: new SecondaryBodyText(msg)
      },
      buttons: {
        confirm: true,
        cancel: true
      },
      onConfirm: () => {
        resolve(true)
        modal.close()
      },
      onClose: () => {
        resolve(false)
      }
    })
  })
}
