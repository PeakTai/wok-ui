import {
  Button,
  DivModule,
  HBox,
  LargeTitle,
  PrimaryBodyText,
  SecondaryBodyText,
  Spacer,
  showWarning
} from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new LargeTitle('按钮'),
      new Spacer('lg'),
      new PrimaryBodyText('不同用途的按钮'),
      new Spacer('sm'),
      new HBox({
        gap: 16,
        wrap: true,
        children: [
          new Button({
            text: '主按钮',
            type: 'primary',
            onClick(ev) {
              showWarning('点击了主要按钮')
            }
          }),
          new Button({ text: '次要/默认', type: 'default' }),
          new Button({ text: '危险', type: 'danger' }),
          new Button({ text: '警告', type: 'warning' }),
          new Button({ text: '成功', type: 'success' })
        ]
      }),
      new Spacer(20),
      new PrimaryBodyText('描边样式'),
      new Spacer('sm'),
      new SecondaryBodyText(
        '镂空（描边样式）按钮仅适合于一些有背景色填充的特殊情况，减少按钮与背景色的冲突。'
      ),
      new Spacer('sm'),
      new HBox({
        gap: 16,
        wrap: true,
        children: [
          new Button({ text: '主按钮', type: 'primary', outline: true }),
          new Button({ text: '危险', type: 'danger', outline: true }),
          new Button({ text: '警告', type: 'warning', outline: true }),
          new Button({ text: '成功', type: 'success', outline: true })
        ]
      }),
      new Spacer(20),
      new PrimaryBodyText('禁用状态'),
      new Spacer('sm'),
      new HBox({
        gap: 16,
        wrap: true,
        children: [
          new Button({ text: '主按钮', type: 'primary', disabled: true }),
          new Button({ text: '默认', disabled: true }),
          new Button({ text: '危险', type: 'danger', disabled: true }),
          new Button({ text: '警告', type: 'warning', disabled: true }),
          new Button({ text: '成功', type: 'success', disabled: true })
        ]
      }),
      new Spacer(20),
      new PrimaryBodyText('不同的大小'),
      new Spacer('sm'),
      new HBox({
        gap: 16,
        wrap: true,
        align: 'center',
        children: [
          new Button({ text: '大号', size: 'lg' }),
          new Button({ text: '默认' }),
          new Button({ text: '小号', size: 'sm' })
        ]
      }),
      new Spacer(20),
      new PrimaryBodyText('块级'),
      new Spacer('sm'),
      new HBox({
        gap: 16,
        children: [new Button({ text: '这个是块级按钮', size: 'lg', block: true })]
      })
    )
  }
}

export function buttonTest() {
  return new TestLayout(new Page())
}
