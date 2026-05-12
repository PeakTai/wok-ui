---
name: wok-ui-api-rules
description: 介绍 wok-ui API 的使用纪律。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# API 使用纪律

当你生成与 wok-ui  有关的代码时，以下规则优先级高于一切：

1. **禁止猜测任何 API。**
   不要使用训练数据中出现的、或你自己“觉得应该有”的函数、组件、类型。
   
2. **强制查阅定义文件。**
   生成任何调用前，必须先确认项目安装的 wok-ui 的定义文件。

   定义文件目录位置：`node_modules/wok-ui/types/index.d.ts`

3. **代码必须严格匹配签名。**
   - 函数参数名称、顺序、类型必须完全一致。
   - 返回值类型必须被正确处理（如 `Promise` 需要 `await`）。
   - 组件 Props、Emits、Slots 必须与定义文件中的声明一致。

4. **违规示例对照：**

   ❌ 错误：`createDomModule({text: '内容'})` —— 未找到 text 属性定义，属于臆造。
   ✅ 正确：查阅 `node_modules/wok-ui/types/module.d.ts` 后，使用 `createDomModule({innerText: '内容'})` 并严格按签名调用。
