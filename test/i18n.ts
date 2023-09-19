import {
  Button,
  FullRenderingModule,
  HBox,
  LargeTitle,
  Spacer,
  getI18n,
  rem,
  showWarning
} from '../lib'
import { TestLayout } from './layout'

class Page extends FullRenderingModule {
  constructor() {
    super()
    getI18n().setMsgs('Tibt', {
      confirm: 'གཏན་འཁེལ་',
      cancel: 'ཕྱིར་འབུད་བྱ་ཡུལ།',
      'form-err-required': 'འདེམས་ཚན་ངེས་པར་དུ་འབྲི་དགོས།',
      'form-err-must-check': 'འདི་འདེམས་རོགས་།',
      'form-err-number': 'ཨང་ཀིས་ནང་འཇུག་རོགས།',
      'form-err-min': '{}ལས་ཆུང་མི་ཆོག',
      'form-err-max': '{}ལས་ཆེ་མི་རུང་།',
      'form-err-min-select': 'མ་ཐར་ཡང་འདེམས་ཁ{}འདེམས་རོགས།',
      'form-err-max-select': 'གདམ་ག་མང་ཤོས་{}གདམ་ག་བྱས་ཆོག་།',
      'form-err-min-length': 'ཉུང་མཐར་ཡང་{}ཡི་ཡིག་རྟགས་ནང་འཇུག་རོགས་།',
      'form-err-max-length': 'ཆེས་མང་སྲིད་པའི་ཚད་{}ཡིག་རྟགས། '
    })
    this.render()
  }

  protected buildContent(): void {
    const i18n = getI18n()
    this.addChild(
      new LargeTitle('国际化'),
      new Spacer('lg'),
      `当前语言：${i18n.getLang()}`,
      new Spacer(),
      `${i18n.buildMsg('confirm')} / ${i18n.buildMsg('cancel')}`,
      new Spacer(),
      `${i18n.buildMsg('form-err-required')}`,
      new Spacer(),
      `${i18n.buildMsg('form-err-must-check')}`,
      new Spacer(),
      `${i18n.buildMsg('form-err-min', '1')}`,
      new Spacer(),
      `${i18n.buildMsg('form-err-max', '8')}`,
      new Spacer(),
      `${i18n.buildMsg('form-err-max-select', '6')}`,
      new Spacer(),
      `${i18n.buildMsg('form-err-min-select', '2')}`,
      new Spacer(),
      `${i18n.buildMsg('form-err-min-length', '2')}`,
      new Spacer(),
      `${i18n.buildMsg('form-err-max-length', '32')}`,
      new Spacer(),
      new HBox({
        gap: rem(1),
        children: [
          new Button({
            text: '切换为中文',
            onClick: ev => {
              i18n.setLang('zh-cn')
              this.render()
            }
          }),
          new Button({
            text: 'switch to english',
            onClick: ev => {
              const res = i18n.setLang('en-us')
              console.log('english', res)
              this.render()
            }
          }),
          new Button({
            text: '切换到自定义的藏语',
            onClick: ev => {
              const res = i18n.setLang('tibt')
              if (!res) {
                showWarning('设置为藏语失败')
              }
              this.render()
            }
          })
        ]
      })
    )
  }
}

export function i18nTest() {
  return new TestLayout(new Page())
}
