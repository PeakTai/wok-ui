import {
  Animation,
  Button,
  DivModule,
  HBox,
  Spacer,
  animate,
  createDomModule,
  getColor,
  rem
} from 'wok-ui'

/**
 * 各种预设动画类型效果
 */
export default class AnimateBasicDemo extends DivModule {
  private targetEl!: HTMLElement
  private target = createDomModule({
    preHandle: el => {
      this.targetEl = el
    },
    style: {
      display: 'inline-block',
      backgroundColor: getColor().primary,
      color: '#fff',
      padding: '1rem 2rem'
    },
    innerText: 'Target'
  })

  constructor() {
    super()
    const animations: Array<[string, Animation]> = [
      ['Fade', Animation.FADE],
      ['Scale Up', Animation.SCALE_UP],
      ['Scale Down', Animation.SCALE_DOWN],
      ['Slide Top', Animation.SLIDE_TOP],
      ['Slide Bottom', Animation.SLIDE_BOTTOM],
      ['Slide Left', Animation.SLIDE_LEFT],
      ['Slide Right', Animation.SLIDE_RIGHT],
      ['Shake', Animation.SHAKE]
    ]
    this.addChild(
      createDomModule({ children: [this.target] }),
      new Spacer(),
      new HBox({
        gap: rem(1),
        wrap: true,
        children: animations.map(
          ([text, animation]) =>
            new Button({
              text,
              size: 'sm',
              onClick: () => {
                animate({ el: this.targetEl, animation, duration: 800 })
              }
            })
        )
      })
    )
  }
}
