import {
  Button,
  DivModule,
  Form,
  HBox,
  LargeTitle,
  Link,
  Spacer,
  TextInput,
  createDomModule,
  rem,
  showModal,
  showSuccess,
  showWarning
} from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new LargeTitle('模态框'),
      rem(1),
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({
            text: '普通模态框',
            onClick(ev) {
              showModal({ title: '标题', body: '这里是模态框要展示的内容' })
            }
          }),
          new Button({
            text: '无标题的模态框',
            onClick(ev) {
              showModal({ body: '无标题的模态框' })
            }
          }),
          new Button({
            text: '全屏的模态框',
            onClick(ev) {
              showModal({
                title: '全屏演示',
                body: '这个模态框将会铺满整个窗口',
                fullscreen: true
              })
            }
          }),
          new Button({
            text: '静态背景',
            onClick(ev) {
              showModal({
                title: '静态背景',
                staticBackDrop: true,
                body: '背景没有功能，不能通过点击背景来关闭'
              })
            }
          }),
          new Button({
            text: '带按钮的模态框',
            onClick(ev) {
              const modal = showModal({
                title: '带按钮演示',
                body: '这里是模态框要展示的内容',
                buttons: { confirm: true, cancel: '退出' },
                staticBackDrop: true,
                onConfirm() {
                  showSuccess('点击了确认')
                  // 确认触发不会关闭模态框，需要主要调用 close 方法来在行当的时候关闭
                  modal.close()
                },
                onClose() {
                  showWarning('模态框被关闭了')
                }
              })
            }
          }),
          new Button({
            text: '多层模态框',
            onClick(ev) {
              showModal({
                title: '第一层模态框',
                body: new Link({
                  content: '点击弹出第二层',
                  onClick(ev) {
                    showModal({
                      title: '第二层模态框',
                      body: '实际开发中不能嵌套太多，否则难以维护',
                      onClose: () => showWarning('第二层关闭')
                    })
                  }
                }),
                onClose: () => showWarning('第一层关闭')
              })
            }
          }),
          new Button({
            text: '完全自定义内容',
            onClick(ev) {
              const modal = showModal({
                replaceByBody: true,
                staticBackDrop: true,
                body: createDomModule({
                  style: { color: 'white' },
                  onClick(ev) {
                    ev.stopPropagation()
                  },
                  children: [
                    '整个模态框的内容被自定义的 body 替换，实现一些特殊效果',
                    new Spacer(20),
                    new Button({
                      text: '点击这里关闭',
                      type: 'primary',
                      onClick(ev) {
                        ev.stopPropagation()
                        modal.close()
                      }
                    })
                  ]
                })
              })
            }
          }),
          new Button({
            text: '对话框居中显示',
            onClick(ev) {
              showModal({
                dialogCentered: true,
                title: '内容居中演示',
                body: '内容居中显示'
              })
            }
          }),
          new Button({
            text: '嵌入表单',
            onClick(ev) {
              let input: TextInput
              let form: Form
              const modal = showModal({
                dialogCentered: true,
                title: '嵌套表单演示',
                body: (form = new Form({
                  onSubmit() {
                    showSuccess('提交成功')
                    modal.close()
                  },
                  children: [
                    '评论内容',
                    new Spacer('sm'),
                    (input = new TextInput({
                      placeholder: '2至32个字',
                      required: true,
                      minLength: 2,
                      maxLength: 32
                    }))
                  ]
                })),
                onShown() {
                  input.focus()
                },
                buttons: {
                  confirm: '提交',
                  cancel: true
                },
                onConfirm() {
                  form.submit()
                }
              })
            }
          })
        ]
      })
    )
  }
}

export function modalTest() {
  return new TestLayout(new Page())
}
