import {
  FullRenderingModule,
  H1,
  HBox,
  Link,
  PrimaryBodyText,
  SecondaryBodyText,
  SmallSecondaryBodyText,
  Spacer,
  Text,
  VBox,
  createDomModule,
  resetSize,
  rem,
  setSize
} from '../lib'
import { TestLayout } from './layout'

class Page extends FullRenderingModule {
  constructor() {
    super()
    this.render()
  }
  protected buildContent(): void {
    this.addChild(
      new H1('文本'),
      new Spacer(20),
      new VBox({
        gap: rem(1),
        children: [
          new PrimaryBodyText(
            '首要正文，首要正文，首要正文，首要正文，首要正文，首要正文，首要正文，首要正文，首要正文，首要正文，首要正文'
          ),
          new SecondaryBodyText(
            '次要正文，次要正文，次要正文，次要正文，次要正文，次要正文，次要正文，次要正文，次要正文，次要正文，次要正文'
          ),
          new Text({
            size: 'sm',
            text: '小号文本小号文本小号文本小号文本小号文本小号文本小号文本小号文本小号文本小号文本小号文本小号文本，号文本小号文本小号文本小号文本小号文本小号文本'
          }),
          new SmallSecondaryBodyText(
            '小号次要正文,小号次要正文,小号次要正文,小号次要正文，小号次要正文,小号次要正文,小号次要正文,小号次要正文'
          ),
          new HBox({
            wrap: true,
            gap: rem(1),
            children: [
              new Text({
                text: '主题色文字',
                color: 'primary'
              }),
              new Text({
                text: '警告色文字',
                color: 'warning'
              }),
              new Text({
                text: '成功色文字',
                color: 'success'
              }),
              new Text({
                text: '危险色文字',
                color: 'danger'
              }),
              new Text({
                text: '自定义颜色文字',
                color: '#3df'
              })
            ]
          }),
          createDomModule({
            children: [
              new SecondaryBodyText('通过 setSize 函数可以自定义文字大小，'),
              new Link({
                content: '点击测试随机自定义文字大小',
                onClick: () => {
                  const size = this.renadomSize()
                  setSize({
                    text: size,
                    textSm: size - 2,
                    textLg: size + 2,
                    textXl: size + 4
                  })
                  this.render()
                }
              }),
              new SecondaryBodyText('，'),
              new Link({
                content: '点击此处恢复成默认',
                onClick: () => {
                  resetSize()
                  this.render()
                }
              })
            ]
          })
        ]
      })
    )
  }

  private renadomSize() {
    return 12 + Math.floor(Math.random() * 30)
  }
}

export function textTest() {
  return new TestLayout(new Page())
}
