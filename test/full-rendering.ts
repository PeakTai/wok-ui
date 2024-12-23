import {
  Button,
  DivModule,
  FullRenderingModule,
  HBox,
  LargeTitle,
  PrimaryBodyText,
  SecondaryBodyText,
  Spacer,
  TextInput,
  rem,
  showWarning
} from '../lib'
import { TestLayout } from './layout'

class Input extends DivModule {
  constructor() {
    super('cache-test-input')
    this.addChild(
      new TextInput({
        placeholder: '输入点内容，试试看吧',
        maxLength: 128
      })
    )
  }

  destroy(): void {
    showWarning('被缓存的输入框销毁')
    super.destroy()
  }
}

class Page extends FullRenderingModule {
  private renderCount = 0

  constructor() {
    super()
    this.render()
  }

  protected buildContent(): void {
    this.renderCount++
    this.addChild(
      new LargeTitle('全量渲染测试'),
      new Spacer('lg'),
      new PrimaryBodyText(`这是第 ${this.renderCount} 次渲染`),
      new Spacer(),
      this.cacheModule({
        key: 't1',
        module: () =>
          new PrimaryBodyText(
            `渲染次数 ${this.renderCount}，由于该模块被缓存，不会重新渲染，所以数值一直不变`
          )
      }),
      new Spacer(),
      new SecondaryBodyText(
        '下面的输入框被缓存，没有处理任何回调，记录任何状态，但是重新渲染后输入的内容保持不变'
      ),
      new Spacer('sm'),
      this.cacheModule({
        key: 'input',
        module: () => new Input()
      }),
      new Spacer(),
      new HBox({
        gap: rem(1),
        children: [
          new Button({
            text: '点击重新渲染',
            onClick: () => {
              // 多次调用，也只会渲染一次，可观察记录渲染次数的第一个文本模块
              this.render()
              this.render()
              this.render()
              this.render()
              this.render()
            }
          }),
          new Button({
            text: '立即渲染两次',
            onClick: () => {
              // 调用几次就渲染几次
              this.render(true)
              this.render(true)
            }
          }),
          new Button({
            text: '清理掉缓存后再渲染',
            onClick: () => {
              this.clearCaches()
              this.render()
            }
          })
        ]
      })
    )
  }
}

export function fullRenderingTest() {
  return new TestLayout(new Page())
}
