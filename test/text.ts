import {
  FullRenderingModule,
  LargeTitle,
  Link,
  PrimaryBodyText,
  SecondaryBodyText,
  Spacer,
  Text,
  Title,
  VBox,
  createDomModule,
  resetSize,
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
      new LargeTitle('文本'),
      new Spacer(20),
      new VBox({
        gap: 10,
        children: [
          new PrimaryBodyText(
            '首要正文，首要正文，首要正文，首要正文，首要正文，首要正文，首要正文，首要正文，首要正文，首要正文，首要正文'
          ),
          new SecondaryBodyText(
            '次要正文，次要正文，次要正文，次要正文，次要正文，次要正文，次要正文，次要正文，次要正文，次要正文，次要正文'
          ),
          new Text({
            size: 'sm',
            text: '小号文本小号文本小号文本小号文本小号文本小号文本小号文本小号文本小号文本小号文本小号文本小号文本'
          }),
          new Title('标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题'),
          new LargeTitle(
            '大号标题大号标题大号标题大号标题大号标题大号标题大号标题大号标题大号标题大号标题大号标题'
          ),
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
