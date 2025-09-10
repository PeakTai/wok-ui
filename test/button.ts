import {
  Button,
  DivModule,
  H1,
  HBox,
  PrimaryBodyText,
  RemoteSvgIcon,
  SecondaryBodyText,
  Spacer,
  SvgIcon,
  rem,
  showWarning
} from '../lib'
import { TestLayout } from './layout'

class IconSearch extends SvgIcon {
  constructor() {
    super(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg>`
    )
  }
}

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new H1('按钮'),
      new Spacer('lg'),
      new PrimaryBodyText('不同用途的按钮'),
      new Spacer('sm'),
      new HBox({
        gap: rem(1),
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
      new Spacer('lg'),
      new PrimaryBodyText('描边样式'),
      new Spacer('sm'),
      new SecondaryBodyText(
        '镂空（描边样式）按钮仅适合于一些有背景色填充的特殊情况，减少按钮与背景色的冲突。'
      ),
      new Spacer('sm'),
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({ text: '主按钮', type: 'primary', outline: true }),
          new Button({ text: '危险', type: 'danger', outline: true }),
          new Button({ text: '警告', type: 'warning', outline: true }),
          new Button({ text: '成功', type: 'success', outline: true })
        ]
      }),
      new Spacer('lg'),
      new PrimaryBodyText('禁用状态'),
      new Spacer('sm'),
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({ text: '主按钮', type: 'primary', disabled: true }),
          new Button({ text: '默认', disabled: true }),
          new Button({ text: '危险', type: 'danger', disabled: true }),
          new Button({ text: '警告', type: 'warning', disabled: true }),
          new Button({ text: '成功', type: 'success', disabled: true })
        ]
      }),
      new Spacer('lg'),
      new PrimaryBodyText('带图标'),
      new Spacer('sm'),
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({ text: '图标在左', type: 'primary', icon: new IconSearch() }),
          new Button({
            text: '图标在左',
            type: 'primary',
            icon: new IconSearch(),
            iconPosition: 'end'
          }),
          new Button({
            text: '远程图标',
            type: 'success',
            icon: new RemoteSvgIcon('/wok-ui/icons/android.svg')
          }),
          new Button({
            text: '描边带图标',
            type: 'warning',
            outline: true,
            icon: new RemoteSvgIcon('/wok-ui/icons/android.svg')
          })
        ]
      }),
      new Spacer('lg'),
      new PrimaryBodyText('不同的大小'),
      new Spacer('sm'),
      new HBox({
        gap: rem(1),
        wrap: true,
        align: 'center',
        children: [
          new Button({ text: '大号', size: 'lg' }),
          new Button({ text: '默认' }),
          new Button({ text: '小号', size: 'sm' }),
          new Button({
            text: '大号带图标',
            size: 'lg',
            icon: new RemoteSvgIcon('/wok-ui/icons/apple.svg')
          }),
          new Button({
            text: '小号带图标',
            size: 'sm',
            icon: new RemoteSvgIcon('/wok-ui/icons/apple.svg')
          })
        ]
      }),
      new Spacer('lg'),
      new PrimaryBodyText('块级'),
      new Spacer('sm'),
      new Button({ text: '这个是块级按钮', size: 'lg', block: true }),
      new Spacer('sm'),
      new Button({
        text: '块级按钮带图标',
        size: 'lg',
        block: true,
        icon: new RemoteSvgIcon('/wok-ui/icons/chrome.svg')
      })
    )
  }
}

export function buttonTest() {
  return new TestLayout(new Page())
}
