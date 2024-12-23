import {
  Grid,
  LargeTitle,
  PrimaryBodyText,
  ResponsiveModule,
  ResponsiveSize,
  SecondaryBodyText,
  Spacer,
  createDomModule,
  getColor,
  rem,
  Link
} from '../lib'
import { TestLayout } from './layout'

class Page extends ResponsiveModule {
  private renderCount = 0
  constructor() {
    super()
    this.render()
  }

  buildContent(sizeInfo: { respSize: ResponsiveSize; windowWidth: number }): void {
    let cols = 2
    switch (sizeInfo.respSize) {
      case 'xs':
        cols = 2
        break
      case 'sm':
        cols = 3
        break
      case 'md':
        cols = 4
        break
      case 'lg':
        cols = 5
        break
      case 'xl':
        cols = 6
        break
      case 'xxl':
        cols = 7
        break
    }
    this.renderCount++
    this.addChild(
      new LargeTitle('响应式渲染'),
      new Spacer('lg'),
      new SecondaryBodyText(
        '拖动改变窗口大小来进行测试，每当页面宽度达到一个分隔点的临界值，内容就会重新渲染'
      ),
      new Spacer(),
      new PrimaryBodyText(`当前是第 ${this.renderCount} 次渲染，`),
      new Link({ content: '立即强制渲染一次', onClick: () => this.render(true, true) }),
      new Spacer(),
      new SecondaryBodyText(
        `当前的响应式尺寸信息：${sizeInfo.respSize}，下面网络显示为每行 ${cols} 列`
      ),
      new Spacer(),
      new Grid({
        cols,
        gap: rem(0.5),
        cells: [...new Array(36)].map((v, idx) =>
          createDomModule({
            style: {
              border: `1px solid ${getColor().border}`,
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            },
            innerText: `${sizeInfo.respSize}-${idx}`
          })
        )
      })
    )
  }
}

export function responsiveTest() {
  return new TestLayout(new Page())
}
