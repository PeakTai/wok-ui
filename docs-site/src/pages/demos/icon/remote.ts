import { DivModule, HBox, RemoteSvgIcon, getSize } from 'wok-ui'

/**
 * 远程 SVG 图标
 */
export default class IconRemoteDemo extends DivModule {
  constructor() {
    super()
    const base = '/wok-ui/vendor/fontawesome-5.15.4/svgs/brands/'
    const size = getSize().textXl
    this.addChild(
      new HBox({
        gap: 16,
        children: [
          new RemoteSvgIcon(`${base}android.svg`).setSize(size),
          new RemoteSvgIcon(`${base}apple.svg`).setSize(size),
          new RemoteSvgIcon(`${base}chrome.svg`).setSize(size),
          new RemoteSvgIcon(`${base}firefox.svg`).setSize(size)
        ]
      })
    )
  }
}
