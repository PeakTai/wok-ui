import { Button, DivModule, HBox, LargeTitle, Spacer, showDrawer, showWarning } from '../lib'
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
          })
        ]
      })
    )
  }
}

export function drawerTest() {
  return new TestLayout(new Page())
}
