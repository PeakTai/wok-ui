# 项目结构

如果现在需要创建一个 wok-ui 项目，以下是推荐的项目目录结构：

```
my-wok-ui-project/
├── src/ 项目源代码目录
│   ├── api/ API 目录，包含与后端交互的代码
│   ├── pages/ 页面目录
│   ├── modules/ 模块目录，包含自定义的模块代码
│   ├── utils/ 工具目录，包含一些辅助函数或类
│   └── main.ts 应用入口文件，负责路由初始化和挂载
├── public/ 静态资源目录
│   └── favicon.ico 网站图标
├── package.json 项目依赖配置文件
├── tsconfig.json TypeScript 配置文件
├── vite.config.ts Vite 配置文件
├── .prettierrc Prettier 配置文件
└── index.html vite 打包应用入口 HTML 文件
```

> 项目通过 `npm create wok-ui` 脚手架命令生成，目录结构与上述推荐基本一致。
