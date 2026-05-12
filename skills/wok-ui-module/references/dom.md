# 保持 DOM 元素引用，调用 DOM 方法

模块内部有个 el 属性，是模块根元素的引用，大部分时候我们只关注这个元素就可以了。

如果想对某个内部元素保持引用，有两个方法：

1. 直接使用 dom api 创建的元素，赋值给模块的属性
2. 通过字面量构建时，在 preHandle 或 postHandle 方法中获取元素引用


第一种方案示例：

```typescript
import { Module } from 'wok-ui'

class SearchBox extends Module{
  // dom 元素引用，用于设置输入值和获取输入值
  private input: HTMLInputElement
  constructor(){
    super(document.createElement('form'))
    this.input = document.createElement('input')
    this.input.type = 'search'
    this.input.placeholder = '请输入搜索内容'
    this.addChild(this.input)
  }

  setValue(value: string){
    // 调用 dom 元素的方法，设置输入值
    this.input.value = value
  }
}
```

实际开发中，往往比较复杂，第一种方案会很啰嗦，不如字面量方式结构好，可读性差一些。

第二种方案示例：

```typescript
import { Module } from 'wok-ui'

class SearchBox extends Module {
  // dom 元素引用，用于设置输入值和获取输入值
  private input?: HTMLInputElement
  constructor() {
    super(document.createElement('form'))
    this.addChild({
      tag: 'input',
      attrs: {
        type: 'search',
        placeholder: '请输入搜索内容'
      },
      preHandle: (el) => {
        // 在 input 的构建的前置阶段，获取元素引用
        this.input = el as HTMLInputElement
      },
      postHandle: (el) => {
        // 在 input 的构建的后置阶段，获取元素引用
        this.input = el as HTMLInputElement
      }
    })
  }

  setValue(value: string) {
    // 调用 dom 元素的方法，设置输入值
    if (this.input) {
      this.input.value = value
    }
  }
}
```
