import {
  Button,
  DivModule,
  HBox,
  LargeTitle,
  Spacer,
  hideLoading,
  rem,
  showAlert,
  showConfirm,
  showLoading,
  showSuccess,
  showToast,
  showWarning
} from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new LargeTitle('消息提示'),
      new Spacer(20),
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({
            text: '全屏 loading',
            onClick(ev) {
              showLoading()
              setTimeout(() => {
                hideLoading()
              }, 2000)
            }
          }),
          new Button({
            text: '全屏 loading 带文字',
            onClick(ev) {
              showLoading('正在加载中，请稍等...')
              setTimeout(() => {
                hideLoading()
              }, 2000)
            }
          }),
          new Button({
            type: 'warning',
            outline: true,
            text: '弹出式警告消息',
            onClick(ev) {
              showWarning('这是一条警告消息')
            }
          }),
          new Button({
            type: 'success',
            outline: true,
            text: '弹出式成功消息',
            onClick(ev) {
              showSuccess('操作成功！！！！！！！')
            }
          }),
          new Button({
            type: 'success',
            outline: true,
            text: '自定义弹出式消息',
            onClick(ev) {
              showToast({
                type: 'success',
                text: '我要 5s 才会消失，和别的消息不一样',
                duration: 5000
              })
            }
          }),
          new Button({
            type: 'warning',
            outline: true,
            text: '强制交互警告消息',
            onClick(ev) {
              showAlert('程序发生错误，是否继续')
                .then(() => {
                  showSuccess('好的，让我们忘掉 bug ，继续其它操作')
                })
                .catch(showWarning)
            }
          }),
          new Button({
            type: 'warning',
            outline: true,
            text: '弹窗确认消息',
            onClick(ev) {
              showConfirm('是否无视风险，继续操作？')
                .then(res => {
                  if (res) {
                    showSuccess('好的，让我们开始冒险！')
                  } else {
                    showSuccess('放弃不失为一个好的选择。')
                  }
                })
                .catch(showWarning)
            }
          })
        ]
      })
    )
  }
}
export function messageTest() {
  return new TestLayout(new Page())
}
