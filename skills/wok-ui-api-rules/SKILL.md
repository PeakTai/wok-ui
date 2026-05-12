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
   不要使用训练数据中出现的、或你自己"觉得应该有"的函数、组件、类型。

   消除臆造的具体方法：
   - 生成任何调用前，必须先查阅项目安装的 wok-ui 定义文件：`node_modules/wok-ui/types/index.d.ts`
   - 代码必须严格匹配签名——函数参数名称、顺序、类型完全一致，返回值类型正确处理（如 `Promise` 需 `await`）

   示例：
   ❌ 错误：`createDomModule({text: '内容'})` —— 未找到 text 属性定义，属于臆造。
   ✅ 正确：查阅 `node_modules/wok-ui/types/module.d.ts` 后，使用 `createDomModule({innerText: '内容'})` 并严格按签名调用。

2. **项目封装优先于 wok-ui 原生。**
   很多项目会对 wok-ui 内置模块和 API 做二次封装（统一 UI 风格、注入上下文、埋点上报等）。
   在生成代码前，必须先确认项目是否存在封装，如果存在则必须使用项目封装，禁止绕过封装直接导入 wok-ui 原生 API。

   判定方法：
   - 搜索项目中与 wok-ui API 同名的函数/类定义（如项目是否定义了 `showWarning`、`showLoading`、`showSuccess` 等）
   - 搜索项目的导入语句，确认现有代码是从 wok-ui 导入还是从项目内部导入
   - 检查项目封装层目录（如 `modules/`、`components/` 下是否存在封装模块）

   常见需检查的场景（项目频繁封装的业务层组件和 API）：
   | 场景 | wok-ui 原生 | 项目中可能存在的封装 |
   |------|------------|-------------------|
   | 反馈提示 | `showWarning`、`showSuccess`、`showToast`、`showLoading`、`hideLoading` | 项目层封装的同名函数，可能增加了埋点、样式定制 |
   | 对话框 | `showAlert`、`showConfirm` | 项目层封装的同名函数，可能定制了按钮文案或交互 |
   | Modal | `Modal` | 项目封装的 Modal 组件，预设了统一的遮罩样式、关闭行为、层级管理 |
   | Drawer | `Drawer` | 项目封装的 Drawer 组件，预设了统一的滑出方向、宽度、关闭行为 |
   | 表格 | `Table` | 项目封装的表格组件，预设了统一的分页、筛选、排序、空状态等 |
   | 表单 | `Form`、`TextInput`、`Select` 等 | 项目封装的表单组件，预设了统一的校验规则、布局或样式 |
   | 按钮 | `Button` | 项目封装的按钮组件，预设了统一的文案、样式 |

   > ⚠️ **例外：wok-ui 模块核心基础功能禁止重新封装。** `Module`、`DivModule`、`FullRenderingModule`、`ResponsiveModule`、
   > `ConvertibleModule`、`SubModulesOpt`、`createDomModule` 以及模块生命周期相关的基础构建块，项目中不得再次封装，
   > 否则会导致逻辑问题。AI 生成代码时直接使用 wok-ui 原生导出，不要搜索这类基础功能的项目封装。

   违规示例：
   ❌ 错误：项目中已有 `import { showWarning } from '@/modules'`，新代码却写 `import { showWarning } from 'wok-ui'`。
   ✅ 正确：与项目现有代码保持一致，使用 `import { showWarning } from '@/modules'`。


