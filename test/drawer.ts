import {
  Button,
  DivModule,
  Form,
  HBox,
  LargeTitle,
  Spacer,
  TextInput,
  rem,
  showDrawer,
  showWarning
} from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new LargeTitle('抽屉'),
      new Spacer(20),
      new HBox({
        gap: 16,
        wrap: true,
        children: [
          new Button({
            text: '右侧弹出抽屉',
            onClick(ev) {
              showDrawer({
                title: '右侧弹出的抽屉',
                placement: 'right',
                body: '右侧弹出的抽屉',
                onClose() {
                  showWarning('抽屉关闭了')
                }
              })
            }
          }),
          new Button({
            text: '底部弹出抽屉',
            onClick(ev) {
              showDrawer({
                title: '底部弹出的抽屉',
                placement: 'bottom',
                body: '底部弹出的抽屉'
              })
            }
          }),
          new Button({
            text: '顶部弹出抽屉',
            onClick(ev) {
              showDrawer({
                title: '顶部弹出的抽屉',
                placement: 'top',
                body: '顶部弹出的抽屉'
              })
            }
          }),
          new Button({
            text: '顶部弹出无标题抽屉',
            onClick(ev) {
              showDrawer({
                placement: 'top',
                body: '顶部弹出无标题的抽屉'
              })
            }
          }),
          new Button({
            text: '开启多个抽屉',
            onClick(ev) {
              showDrawer({
                title: '这是第一个',
                placement: 'right',
                body: new Button({
                  text: '点击从左边再开一个',
                  onClick(ev) {
                    showDrawer({
                      title: '第二个抽屉',
                      placement: 'left',
                      body: '点击背景会按照开启的顺序倒序逐个关闭抽屉'
                    })
                  }
                })
              })
            }
          }),
          new Button({
            text: '自定义关闭按钮',
            onClick(ev) {
              const drawer = showDrawer({
                title: '自定义关闭按钮',
                placement: 'right',
                body: new Button({
                  text: '点击关闭抽屉',
                  type: 'warning',
                  onClick(ev) {
                    drawer.close()
                  }
                }),
                onClose() {
                  showWarning('抽屉关闭了')
                }
              })
            }
          }),
          new Button({
            text: '完全自定义',
            onClick(ev) {
              const drawer = showDrawer({
                title: '标题不会显示出来',
                placement: 'right',
                replaceByBody: true,
                body: {
                  style: {
                    background: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  children: [
                    '这里是完全自定义的内容',
                    rem(1),
                    new Button({
                      text: '点击关闭窗口',
                      onClick: () => drawer.close()
                    })
                  ]
                },
                onClose() {
                  showWarning('抽屉关闭了')
                }
              })
            }
          }),
          new Button({
            text: '嵌入表单，自动聚集',
            onClick(ev) {
              let input: TextInput
              showDrawer({
                title: '嵌入表单',
                placement: 'right',
                body: new Form({
                  children: [
                    '请输入手机号',
                    new Spacer('sm'),
                    (input = new TextInput({
                      placeholder: '不得超过15个字符',
                      required: true,
                      maxLength: 15
                    })),
                    new Spacer(),
                    new Button({ text: '下一步', type: 'primary', formType: 'submit' })
                  ]
                }),
                onShown() {
                  input.focus()
                }
              })
            }
          })
        ]
      }),
      // 垫高，测试滚动锁定，当抽屉弹出时，页面将不能滚动
      {
        style: { height: '1500px' }
      }
    )
  }
}

export function drawerTest() {
  return new TestLayout(new Page())
}
