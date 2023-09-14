import {
  DivModule,
  Grid,
  HBox,
  HSplitBox,
  JustifyBox,
  LargeTitle,
  PrimaryBodyText,
  SecondaryBodyText,
  Spacer,
  Text,
  Title,
  VBox,
  VSplitBox,
  createDomModule,
  getColor,
  rem
} from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new LargeTitle('布局'),
      new Spacer(20),
      new Title('HBox 水平堆叠容器'),
      new Spacer(10),
      new HBox({
        gap: rem(1),
        wrap: true,
        children(addChild) {
          for (let i = 0; i < 20; i++) {
            addChild(`元素 ${i}`)
          }
        }
      }),
      new Spacer(20),
      new Title('VBox 垂直堆叠容器'),
      new Spacer(10),
      new VBox({
        gap: rem(0.5),
        children(addChild) {
          for (let i = 0; i < 20; i++) {
            addChild(`垂直堆叠容器中的元素 ${i}`)
          }
        }
      }),
      new Spacer(20),
      new Title('两端对齐容器'),
      new Spacer(10),
      new JustifyBox({
        align: 'center',
        children: ['容器中的内容', '将会', '两端对齐']
      }),
      new Spacer(),
      new Title('横向分隔视图'),
      new Spacer('sm'),
      new HSplitBox({
        left: createDomModule({
          style: {
            backgroundColor: getColor().textSecondary,
            padding: '1rem',
            width: '150px',
            color: 'white'
          },
          innerText: '这一侧的内容固定 150px'
        }),
        right: createDomModule({
          style: {
            backgroundColor: getColor().primary,
            padding: '1rem',
            color: 'white'
          },
          innerText: '这一侧的内容占满剩余空间'
        }),
        align: 'stretch',
        fixedSide: 'left'
      }),
      new Spacer(),
      new Title('纵向分隔视图'),
      new Spacer('sm'),
      new VSplitBox({
        height: 300,
        top: createDomModule({
          style: { padding: '0.5rem', backgroundColor: getColor().primary, color: 'white' },
          innerText: '顶部不会拉伸'
        }),
        bottom: createDomModule({
          style: {
            backgroundColor: getColor().textSecondary,
            color: 'white',
            padding: '0.5rem'
          },
          innerText: '底部的内容占满剩余空间'
        }),
        fixedSide: 'top'
      }),
      new Spacer(),
      new Title('网格'),
      new Spacer(10),
      new PrimaryBodyText('网格常常可以配合响应式模块来使用，下面展示一行3列的网格'),
      new Spacer(10),
      new Grid({
        cols: 3,
        gap: rem(1),
        cells: [...new Array(10).keys()].map(idx =>
          createDomModule({
            style: {
              backgroundColor: getColor().primary,
              padding: '1rem',
              color: 'white'
            },
            innerText: `单元格 ${idx}`
          })
        )
      })
    )
  }
}

export function layoutTest() {
  return new TestLayout(new Page())
}
