import { Button, DivModule, Spacer, createDomModule, showModal } from 'wok-ui'

/**
 * 完全自定义内容的模态框：replaceByBody 用 body 替换整个模态框
 */
export default class ModalCustomBodyDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Modal',
        onClick() {
          const modal = showModal({
            replaceByBody: true,
            staticBackDrop: true,
            body: createDomModule({
              style: { color: 'white' },
              onClick(ev) {
                ev.stopPropagation()
              },
              children: [
                'The entire modal is replaced by a custom body.',
                new Spacer(20),
                new Button({
                  text: 'Click to Close',
                  type: 'primary',
                  onClick(ev) {
                    ev.stopPropagation()
                    modal.close()
                  }
                })
              ]
            })
          })
        }
      })
    )
  }
}
