import {
  ANIMATION_PROVISION,
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
 * 入场动画与反向退场动画
 */
export default class AnimateReverseDemo extends DivModule {
  private targetEl!: HTMLElement
  private target = createDomModule({
    preHandle: el => {
      this.targetEl = el
    },
    className: ANIMATION_PROVISION,
    style: {
      display: 'inline-block',
      backgroundColor: getColor().success,
      color: '#fff',
      padding: '1rem 2rem'
    },
    innerText: 'Target'
  })

  constructor() {
    super()
    this.addChild(
      createDomModule({ style: { minHeight: '4rem' }, children: [this.target] }),
      new Spacer(),
      new HBox({
        gap: rem(1),
        children: [
          new Button({
            text: 'Enter',
            type: 'primary',
            onClick: () => {
              animate({ el: this.targetEl, animation: Animation.SLIDE_TOP, duration: 800 })
            }
          }),
          new Button({
            text: 'Exit',
            type: 'danger',
            onClick: () => {
              animate({
                el: this.targetEl,
                animation: Animation.SLIDE_TOP,
                duration: 800,
                reverse: true
              }).then(() => {
                // 退场完成后重新隐藏，便于再次入场
                this.targetEl.classList.add(ANIMATION_PROVISION)
              })
            }
          })
        ]
      })
    )
  }
}
