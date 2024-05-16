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
import { getExtI18n } from './i18n'
import { TestLayout } from './layout'

class Page extends FullRenderingModule {
  constructor() {
    super()
    this.render()
  }

  protected buildContent(): void {
    const i18n = getI18n()
    this.addChild(
      new LargeTitle(getExtI18n().buildMsg('internationalization')),
      new Spacer('lg'),
      `${getExtI18n().buildMsg('currentLanguage')}：${i18n.getLang()}`,
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
            onClick: ev =>
              i18n
                .setLang('zh-cn')
                .then(() => this.render())
                .catch(showWarning)
          }),
          new Button({
            text: 'switch to english',
            onClick: ev =>
              i18n
                .setLang('en')
                .then(() => this.render())
                .catch(showWarning)
          }),
          new Button({
            text: getExtI18n().buildMsg('switchToCustomLanguage'),
            onClick: ev =>
              i18n
                .setLang('ja')
                .then(() => this.render())
                .catch(showWarning)
          })
        ]
      })
    )
  }
}

export function i18nTest() {
  return new TestLayout(new Page())
}
