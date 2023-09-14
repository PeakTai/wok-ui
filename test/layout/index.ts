import { DivModule, Module } from './../../lib/module'
import './style.less'

/**
 * 测试页面的基本布局，布局的复用，应当以组合形式，而不是继承，不要
 * 让页面模块去继承布局模块.
 */
export class TestLayout extends DivModule {
  constructor(content: Module) {
    super('test-layout')
    this.addChild(content)
  }
}
