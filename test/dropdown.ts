import {
  Button,
  DivModule,
  HBox,
  LargeTitle,
  Spacer,
  Title,
  createDomModule,
  rem,
  showSuccess,
  Dropdown,
  Dropup
} from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new LargeTitle('下拉框'),
      new Spacer('lg'),
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Dropdown({
            menus: [
              {
                label: '菜单一',
                callback() {
                  showSuccess('点击了菜单一')
                }
              },
              {
                label: '菜单二',
                disabled: true,
                callback: () => {
                  showSuccess('如果这条提示出现，那么下拉菜单的禁用就失败了')
                }
              },
              {
                label: '菜单三',
                callback: () => {
                  showSuccess('点击了菜单三')
                }
              }
            ],
            content: new Button({ text: '点击按钮弹出下拉框' })
          }),
          new Dropdown({
            menusAlign: 'right',
            menus: [{ label: '菜单一' }, { label: '菜单二' }, { label: '菜单三' }],
            content: new Button({ text: '弹出的菜单右对齐' })
          }),
          new Dropdown({
            menus: createDomModule({
              style: { padding: `${rem(1)}px`, width: '250px' },
              children: [
                new Title('自定义下拉框菜单'),
                new Spacer(),
                `Dropdown 组件是用于创建带有下拉菜单的用户界面元素，它隐藏了许多选项以便于页面上节省空间。用户可以点击下拉菜单，以便从提供的选项中选择任何选。通常，Dropdown 组件可以用于让用户选择已有选项或者输入自定义内容，它被广泛应用在网站或应用程序的搜索、、访问权限、主导航等功能中。通过 Dropdown 组件的设计实现，可以提供更好的用户体验和可用性，同时也可以简化开发流程和减少代码量。`
              ]
            }),
            content: new Button({ text: '嵌入自定义内容' })
          })
        ]
      }),
      new Spacer(),
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Dropup({
            menus: [{ label: '菜单一' }, { label: '菜单二' }],
            content: new Button({ text: '向上弹出' })
          }),
          new Dropup({
            menus: [{ label: '菜单一' }, { label: '菜单二' }],
            menusAlign: 'right',
            content: new Button({ text: '上弹右对齐' })
          })
        ]
      })
    )
  }
}
export function dropdownTest() {
  return new TestLayout(new Page())
}
