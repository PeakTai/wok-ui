import {
  LargeTitle,
  Link,
  DivModule,
  Spacer,
  getColor,
  PrimaryBodyText,
  SecondaryBodyText,
  createDomModule,
  resetColor,
  FullRenderingModule,
  setColor,
  VBox,
  HBox
} from './../lib'
import { TestLayout } from './layout'
import { generateRandomColor } from './utils/color'

class Page extends FullRenderingModule {
  constructor() {
    super()
    this.render()
  }

  protected buildContent(): void {
    const color = getColor()
    this.addChild(
      new LargeTitle('颜色'),
      new Spacer(20),
      new VBox({
        gap: 10,
        children: [
          new PrimaryBodyText('主题色'),
          new Block(color.primary),
          new PrimaryBodyText('危险色'),
          new Block(color.danger),
          new PrimaryBodyText('成功色'),
          new Block(color.success),
          new PrimaryBodyText('警告色'),
          new Block(color.warning),
          new PrimaryBodyText('边框颜色'),
          new Block(color.border),
          new PrimaryBodyText('文本默认颜色'),
          new Block(color.text),
          new PrimaryBodyText('次级文本颜色'),
          new Block(color.textSecondary),
          new HBox({
            children: [
              new SecondaryBodyText('通过 setColor() 函数可以自定义颜色，'),
              new Link({
                content: '点击测试自定义颜色',
                onClick: ev => {
                  setColor({
                    primary: generateRandomColor(),
                    danger: generateRandomColor(),
                    warning: generateRandomColor(),
                    success: generateRandomColor(),
                    text: generateRandomColor(),
                    textSecondary: generateRandomColor(),
                    border: generateRandomColor()
                  })
                  this.render()
                }
              }),
              new SecondaryBodyText('，现在也可以'),
              new Link({
                content: '点击此处恢复成默认',
                onClick: () => {
                  resetColor()
                  this.render()
                }
              })
            ]
          })
        ]
      })
    )
  }
  destroy(): void {
    resetColor()
    super.destroy()
  }
}

class Block extends DivModule {
  constructor(color: string) {
    super()
    this.el.style.height = '1em'
    this.el.style.backgroundColor = color
  }
}

export function colorTest() {
  return new TestLayout(new Page())
}
