# vue3-AI-admin

基于 **Vue 3 + Vite + TypeScript + Pinia + Element Plus** 的现代化后台管理系统模板（开箱即用、约定优于配置）。

> 目标：让你把精力放在业务上，而不是从 0 搭脚手架、配工具链。

## 🚀 30 秒快速上手（最短路径）

```bash
pnpm install
pnpm dev
```

- **开发地址**: `http://localhost:5173`
- **环境变量**: 根目录创建 `.env.development`（示例见下方“快速开始 → 配置环境变量”）

## ✨ 你会得到什么（项目亮点）

- **现代化技术栈**：Vue 3.5+ / Vite 7.3+ / TS 5.9+ / Pinia 3+ / Router 5+ / Element Plus 2.13+
- **自动导入**：Vue / Vue Router / Pinia API 与 Element Plus 组件自动导入，减少样板代码
- **工程化规范**：ESLint + Prettier（避免规则冲突），统一代码风格与提交规范建议
- **目录清晰**：按业务模块划分 `api/`、`types/`、`stores/`、`views/`，利于扩展与协作
- **请求封装**：Axios 统一拦截、错误处理、Token 管理（见 `src/utils/request.ts` 说明）
- **主题/布局基础**：布局组件与主题状态（`src/layout/`、`src/stores/theme.ts`）已就绪

## 📌 导航（建议按这个顺序阅读）

- **第一次运行项目**：[#快速开始](#-快速开始)
- **想知道代码放哪**：[#项目结构](#-项目结构)
- **想改代理/端口/自动导入**：[#配置说明](#️-配置说明)
- **想看请求封装/响应格式**：[#api-请求封装-srcutilsrequestts](#api-请求封装-srcutilsrequestts)
- **提交前检查**：[#常用命令](#-常用命令) / [#团队协作](#-团队协作)

## 📋 目录

- [技术栈](#-技术栈)
- [环境要求](#-环境要求)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [配置说明](#️-配置说明)
- [开发规范](#-开发规范)
- [常用命令](#-常用命令)
- [团队协作](#-团队协作)

## 🛠 技术栈

- **框架**: Vue 3.5+ (Composition API)
- **构建工具**: Vite 7.3+
- **语言**: TypeScript 5.9+
- **状态管理**: Pinia 3.0+
- **路由**: Vue Router 5.0+
- **UI 组件库**: Element Plus 2.13+
- **HTTP 客户端**: Axios 1.13+
- **代码规范**: ESLint + TypeScript ESLint
- **样式预处理**: Sass/SCSS
- **包管理器**: pnpm

### 🔧 关键工程化能力（项目里“实际启用”的技术/插件）

> 这一节不是“可选项列表”，而是当前项目已经接入并在运行的能力，方便你快速定位配置与入口。

- **自动导入 API**：`unplugin-auto-import`
  - **作用**：自动导入 `vue` / `vue-router` / `pinia` 常用 API，减少 `import { ref, computed } ...` 样板代码
  - **配置位置**：`vite.config.ts`
  - **生成文件**：`src/auto-imports.d.ts`、`./.eslintrc-auto-import.json`

- **组件按需引入**：`unplugin-vue-components` + `ElementPlusResolver`
  - **作用**：Element Plus 组件与样式按需加载（避免全量引入），并支持 `src/components` 目录全局组件自动注册
  - **配置位置**：`vite.config.ts`
  - **生成文件**：`src/components.d.ts`

- **Element Plus 图标**：`@element-plus/icons-vue`
  - **作用**：Element Plus 图标统一注册后直接在组件中使用
  - **入口位置**：`src/plugins/icons.ts`（注册）与 `src/main.ts`（调用 `registerIcons(app)`）

- **SVG 图标体系**：`vite-plugin-svg-icons` + `virtual:svg-icons-register`
  - **作用**：将 `src/assets/icons` 下的 svg 打包为 symbol，通过 `SvgIcon` 组件统一渲染
  - **配置位置**：`vite.config.ts`（仅目录存在时启用，避免报错）
  - **入口位置**：`src/main.ts` 引入 `virtual:svg-icons-register`

- **Pinia 状态持久化**：`pinia-plugin-persistedstate`
  - **作用**：将指定 store 状态持久化到本地存储（常用于 token、主题、偏好设置等）
  - **入口位置**：`src/main.ts`（`pinia.use(piniaPluginPersistedstate)`）

- **请求与进度条常用库**：`axios` / `nprogress`
  - **作用**：统一 HTTP 请求封装与页面切换/请求加载进度条（具体封装见下方“API 请求封装”章节）

- **Lint/格式化体系**：ESLint 10（Flat Config）+ TypeScript ESLint + eslint-plugin-vue + Prettier
  - **作用**：统一语法/类型/Vue 规则检查，同时用 `eslint-config-prettier` 避免与 Prettier 冲突
  - **配置位置**：`eslint.config.js`
  - **细节**：会读取 `./.eslintrc-auto-import.json` 把自动导入的全局变量加入 ESLint globals

## 📦 环境要求

- **Node.js**: `^20.19.0 || >=22.12.0` (推荐使用 LTS 版本)
- **pnpm**: `>=8.0.0` (推荐使用最新版本)

### 安装 pnpm

```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用 Homebrew (macOS)
brew install pnpm

# 或使用 Scoop (Windows)
scoop install pnpm
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd vue3-AI-admin
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

在项目根目录创建 `.env.development` 文件（开发环境）或 `.env.production` 文件（生产环境）：

```env
# 应用基础配置
VITE_APP_TITLE=vue3-AI-admin

# API 配置
VITE_API_BASE_URL=/dev-api
VITE_API_PROXY_PREFIX=/dev-api

# 功能开关
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK=false
```

> 💡 **提示**: 环境变量文件已添加到 `.gitignore`，不会提交到仓库。请参考项目根目录的 `.env.example`（如果存在）或上述配置创建自己的环境变量文件。

### 4. 启动开发服务器

```bash
pnpm dev
```

项目将在 `http://localhost:5173` 启动（端口可在 `vite.config.ts` 中修改）。

### 5. 构建生产版本

### 6.（可选）你可能会立刻想改的几件事

- **应用标题**：`.env.*` 中的 `VITE_APP_TITLE`
- **接口代理前缀 / 目标地址**：`.env.*` 的 `VITE_API_PROXY_PREFIX` + `vite.config.ts` 的 proxy
- **全局样式变量**：`src/styles/variables.scss`
- **路由入口**：`src/router/index.ts`、路由表 `src/router/routes.ts`

```bash
pnpm build
```

构建产物将输出到 `dist` 目录。

## 📁 项目结构

```
vue3-AI-admin/
├── public/                    # 静态资源目录（构建时直接复制到 dist）
│   └── favicon.ico           # 网站图标
│
├── src/                       # 源代码目录
│   ├── api/                  # API 接口模块
│   │   └── user.ts           # 用户相关接口（按业务模块划分）
│   │
│   ├── assets/               # 静态资源文件
│   │   ├── iconfont/         # 字体图标文件（.ttf, .woff, .woff2）
│   │   ├── icons/            # SVG 图标文件（可选，目录不存在时插件会自动跳过）
│   │   └── images/           # 图片资源
│   │
│   ├── components/           # 全局组件（自动导入，无需手动注册）
│   │   ├── Iconfont.vue      # Iconfont 图标组件
│   │   └── SvgIcon.vue       # SVG 图标组件
│   │
│   ├── plugins/              # 插件配置
│   │   └── icons.ts          # Element Plus 图标注册
│   │
│   ├── router/               # 路由配置
│   │   ├── index.ts          # 路由实例（Hash 模式）
│   │   └── routes.ts         # 路由定义
│   │
│   ├── stores/               # Pinia 状态管理
│   │   └── user.ts           # 用户状态管理（按业务模块划分）
│   │
│   ├── styles/               # 全局样式
│   │   ├── index.scss        # 样式入口（引入所有样式文件）
│   │   ├── reset.scss        # 样式重置（Normalize）
│   │   ├── variables.scss    # SCSS 全局变量（自动注入到所有 SCSS 文件）
│   │   └── iconfont.scss     # 字体图标样式
│   │
│   ├── types/                # TypeScript 类型定义
│   │   └── user.ts           # 用户相关类型（与 API 模块对应）
│   │
│   ├── utils/                # 工具函数
│   │   ├── env.ts            # 环境变量工具（统一管理环境变量）
│   │   └── request.ts        # Axios 请求封装（统一处理请求/响应）
│   │
│   ├── views/                # 页面组件（路由对应的页面）
│   │   ├── 404/              # 404 页面
│   │   │   └── index.vue
│   │   ├── home/             # 首页
│   │   │   └── index.vue
│   │   └── login/            # 登录页
│   │       └── index.vue
│   │
│   ├── App.vue                # 根组件
│   ├── main.ts                # 应用入口（初始化 Vue 应用、插件、路由等）
│   ├── auto-imports.d.ts     # 自动导入类型声明（自动生成，不要手动编辑）
│   └── components.d.ts        # 组件类型声明（自动生成，不要手动编辑）
│
├── .vscode/                   # VS Code 编辑器配置
│   ├── extensions.json        # 推荐扩展列表
│   └── settings.json          # 工作区设置（格式化、ESLint 等）
│
├── .editorconfig              # 编辑器配置（统一代码风格）
├── .eslintrc-auto-import.json # ESLint 自动导入配置（自动生成）
├── .gitattributes             # Git 属性配置（行尾、二进制文件处理）
├── .gitignore                 # Git 忽略配置
├── .prettierignore            # Prettier 忽略配置
├── .prettierrc.json           # Prettier 格式化配置
│
├── env.d.ts                   # 环境变量类型声明
├── eslint.config.js           # ESLint 配置（Flat Config 格式）
├── index.html                 # HTML 模板
├── package.json               # 项目配置（依赖、脚本等）
├── pnpm-lock.yaml             # pnpm 依赖锁定文件
│
├── tsconfig.json              # TypeScript 主配置（项目引用）
├── tsconfig.app.json          # TypeScript 应用配置（src 目录）
├── tsconfig.node.json         # TypeScript Node 配置（配置文件）
│
└── vite.config.ts             # Vite 构建配置
```

### 📝 目录说明

#### 核心目录

- **`src/api/`** - API 接口模块，按业务模块划分文件（如 `user.ts`, `product.ts`）
- **`src/components/`** - 全局可复用组件，会被自动导入，无需手动注册
- **`src/views/`** - 页面组件，对应路由配置，每个页面一个目录
- **`src/stores/`** - Pinia 状态管理，按业务模块划分 store
- **`src/types/`** - TypeScript 类型定义，与 API 模块对应
- **`src/utils/`** - 工具函数，通用功能封装

#### 配置文件

- **`.vscode/`** - VS Code 工作区配置，包含推荐扩展和编辑器设置
- **`.editorconfig`** - 统一编辑器配置（缩进、换行等）
- **`.prettierrc.json`** - Prettier 代码格式化配置
- **`.gitattributes`** - Git 文件属性配置，确保跨平台一致性
- **`tsconfig.*.json`** - TypeScript 配置，使用项目引用模式

#### 自动生成文件

以下文件由工具自动生成，**不应手动编辑**：

- `src/auto-imports.d.ts` - 自动导入的 API 类型声明
- `src/components.d.ts` - 自动导入的组件类型声明
- `.eslintrc-auto-import.json` - ESLint 自动导入全局变量配置

这些文件会在以下情况自动更新：
- 安装/更新依赖后
- 添加新的自动导入 API 后
- 添加新的全局组件后
- 运行 `pnpm dev` 或 `pnpm build` 时

## ⚙️ 配置说明

### Vite 配置 (`vite.config.ts`)

#### 核心插件

1. **Vue 插件** (`@vitejs/plugin-vue`)
   - 支持 Vue 3 SFC（单文件组件）

2. **Vue DevTools** (`vite-plugin-vue-devtools`)
   - 开发环境下的 Vue 调试工具

3. **自动导入** (`unplugin-auto-import`)
   - 自动导入 Vue、Vue Router、Pinia 的 API
   - 无需手动 `import { ref, computed } from 'vue'`
   - 生成类型声明文件：`src/auto-imports.d.ts`

4. **组件自动导入** (`unplugin-vue-components`)
   - 自动导入 Element Plus 组件
   - 自动导入 `src/components` 目录下的组件
   - 生成类型声明文件：`src/components.d.ts`

5. **SVG 图标** (`vite-plugin-svg-icons`)
   - 支持 SVG 图标按需导入
   - 图标目录：`src/assets/icons`

#### 路径别名

- `@` → `src/` 目录

#### 开发服务器

- **端口**: 5173（可在配置中修改）
- **自动打开**: 启动后自动在浏览器打开
- **代理配置**: 
  - 前缀：`/dev-api`（可通过环境变量 `VITE_API_PROXY_PREFIX` 配置）
  - 目标：`http://localhost:3000`（可在 `vite.config.ts` 中修改）

#### SCSS 配置

- 全局变量文件：`src/styles/variables.scss`
- 所有 SCSS 文件自动注入全局变量，无需手动 `@import`

### TypeScript 配置

项目使用 TypeScript 项目引用（Project References）模式：

- **`tsconfig.json`**: 主配置文件，引用应用和 Node 配置
- **`tsconfig.app.json`**: 应用代码配置
  - 启用 `noUncheckedIndexedAccess`（更严格的类型检查）
  - 路径别名：`@/*` → `./src/*`
- **`tsconfig.node.json`**: Node 环境配置（Vite 配置等）

### ESLint 配置 (`eslint.config.js`)

- **基础规则**: JavaScript 推荐配置
- **TypeScript**: TypeScript ESLint 推荐配置
- **Vue**: Vue 3 推荐配置
- **自动导入支持**: 读取 `.eslintrc-auto-import.json` 中的全局变量
- **Prettier 集成**: 使用 `eslint-config-prettier` 避免与 Prettier 冲突
- **自定义规则**:
  - `vue/multi-word-component-names`: 关闭（允许单文件组件名）
  - `@typescript-eslint/no-explicit-any`: 警告
  - `@typescript-eslint/no-unused-vars`: 警告（忽略以 `_` 开头的参数）

### EditorConfig 配置 (`.editorconfig`)

统一不同编辑器和 IDE 的代码风格配置：

- **字符编码**: UTF-8
- **行尾**: LF（Unix 风格）
- **缩进**: 2 个空格
- **文件末尾**: 自动插入空行
- **Markdown 文件**: 特殊处理（保留尾随空格）

支持的编辑器：VS Code、WebStorm、Sublime Text、Atom 等。

### Prettier 配置 (`.prettierrc.json`)

代码格式化配置，与 ESLint 配合使用：

- **分号**: 使用分号
- **引号**: 双引号
- **缩进**: 2 个空格
- **行宽**: 80 字符
- **尾随逗号**: ES5 风格
- **换行**: LF（Unix 风格）

**使用方式**：
- 保存时自动格式化（VS Code 配置）
- 手动格式化：`pnpm format`
- 检查格式：`pnpm format:check`

### VS Code 配置 (`.vscode/`)

#### `settings.json` - 工作区设置

- **保存时自动格式化**: 使用 Prettier
- **保存时自动修复**: ESLint 自动修复
- **自动整理导入**: 保存时自动整理 import 语句
- **文件嵌套**: 相关配置文件自动折叠

#### `extensions.json` - 推荐扩展

- **Vue - Official**: Vue 3 官方扩展（必须）
- **TypeScript Vue Plugin**: TypeScript Vue 支持
- **Prettier**: 代码格式化
- **ESLint**: 代码检查
- **GitLens**: Git 增强工具
- **Error Lens**: 行内错误提示
- **Path Intellisense**: 路径自动补全

### Git 配置

#### `.gitattributes` - Git 文件属性

- **文本文件**: 统一使用 LF 行尾
- **脚本文件**: `.sh` 使用 LF，`.bat`/`.cmd` 使用 CRLF
- **二进制文件**: 正确标记图片、字体等二进制文件
- **锁定文件**: 统一处理包管理器锁定文件

#### `.gitignore` - Git 忽略规则

已配置忽略：
- 依赖目录（`node_modules`）
- 构建产物（`dist`）
- 环境变量文件（`.env*`）
- 编辑器配置（部分）
- 自动生成的文件（`auto-imports.d.ts`, `components.d.ts`）

### 环境变量配置

#### 环境变量类型声明 (`env.d.ts`)

```typescript
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_PROXY_PREFIX: string;
  readonly VITE_ENABLE_DEBUG: boolean;
  readonly VITE_ENABLE_MOCK: boolean;
}
```

#### 环境变量工具 (`src/utils/env.ts`)

提供了统一的环境变量访问接口：

```typescript
import { envConfig } from '@/utils/env';

// 应用标题
envConfig.app.title

// API 配置
envConfig.api.baseURL
envConfig.api.proxyPrefix
envConfig.api.buildUrl('/users')  // 构建完整 API 路径

// 功能开关
envConfig.features.debug
envConfig.features.mock

// 环境判断
envConfig.isDev
envConfig.isProd
envConfig.mode
```

### 自动导入配置

#### Vue API 自动导入

以下 API 无需手动导入，可直接使用：

- **Vue 3**: `ref`, `reactive`, `computed`, `watch`, `onMounted`, `defineComponent` 等
- **Vue Router**: `useRouter`, `useRoute`, `onBeforeRouteLeave` 等
- **Pinia**: `defineStore`, `storeToRefs`, `createPinia` 等

#### Element Plus 组件自动导入

所有 Element Plus 组件无需手动导入，直接使用即可：

```vue
<template>
  <el-button>按钮</el-button>
  <el-input v-model="value" />
</template>
```

#### 全局组件自动导入

`src/components` 目录下的组件会自动导入，无需手动注册。

### 路由配置

- **模式**: Hash 模式 (`createWebHashHistory`)
- **滚动行为**: 页面切换时自动滚动到顶部（平滑滚动）
- **路由定义**: `src/router/routes.ts`

### Pinia 状态管理

- **安装**: 已在 `src/main.ts` 中配置
- **Store 目录**: `src/stores/`
- **使用方式**: 使用 `defineStore` 创建 store（已自动导入）

示例：

```typescript
// src/stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
  }),
  actions: {
    setName(name: string) {
      this.name = name;
    },
  },
});
```

### API 请求封装 (`src/utils/request.ts`)

项目已封装了基于 Axios 的 HTTP 请求工具，提供了完整的请求/响应拦截、错误处理、Token 管理等功能。

#### 核心特性

1. **自动 Token 管理**: 从 Pinia Store 或 localStorage 自动获取并添加 Token
2. **统一错误处理**: 自动处理业务错误和 HTTP 错误，并显示友好的错误提示
3. **请求/响应拦截**: 自动添加请求头、处理响应数据
4. **类型安全**: 完整的 TypeScript 类型支持
5. **开发环境日志**: 开发环境下自动打印请求和响应信息

#### 响应数据格式

```typescript
interface ApiResponse<T = any> {
  code: number;      // 状态码：20000 或 200 表示成功
  message: string;   // 提示信息
  data: T;          // 返回数据
  timestamp?: number; // 时间戳
}
```

#### 使用方法

**基础用法**：

```typescript
import request from '@/utils/request';

// GET 请求
const getUserList = async () => {
  const res = await request.get('/users', { page: 1, size: 10 });
  return res.data; // 返回 ApiResponse.data
};

// POST 请求
const createUser = async (userData: any) => {
  const res = await request.post('/users', userData);
  return res.data;
};

// PUT 请求
const updateUser = async (id: string, userData: any) => {
  const res = await request.put(`/users/${id}`, userData);
  return res.data;
};

// DELETE 请求
const deleteUser = async (id: string) => {
  const res = await request.delete(`/users/${id}`);
  return res.data;
};
```

**自定义配置**：

```typescript
// 不显示加载提示
const res = await request.get('/users', {}, { showLoading: false });

// 不显示错误提示（自行处理错误）
const res = await request.post('/users', data, { showError: false });
```

**文件上传**：

```typescript
const uploadFile = async (file: File) => {
  const res = await request.upload('/upload', file, 'file');
  return res.data;
};
```

**文件下载**：

```typescript
const downloadFile = async (fileId: string) => {
  await request.download(`/files/${fileId}/download`, {}, 'filename.pdf');
};
```

#### 错误处理

请求封装会自动处理以下错误情况：

- **401 未授权**: 自动清除 Token，跳转到登录页
- **403 无权限**: 显示"您没有权限执行此操作"
- **500 服务器错误**: 显示友好的错误提示
- **网络错误**: 自动识别超时、网络连接失败等情况
- **业务错误**: 根据后端返回的 `code` 和 `message` 显示错误提示

#### 配置说明

- **Base URL**: 从环境变量 `VITE_API_BASE_URL` 读取（默认 `/dev-api`）
- **超时时间**: 15 秒
- **Token 来源**: 优先从 Pinia Store (`UserStore`) 获取，其次从 `localStorage.getItem('token')` 获取
- **Token 格式**: `Bearer ${token}`

#### 创建 API 模块

建议在 `src/api/` 目录下创建 API 模块，统一管理接口。类型定义应放在 `src/types/` 目录下：

**1. 定义类型** (`src/types/user.ts`)：

```typescript
export interface UserInterface {
  id: number;
  name: string;
  // 根据实际需求添加其他字段
}
```

**2. 创建 API 模块** (`src/api/user.ts`)：

```typescript
import request from '@/utils/request';
import type { UserInterface } from '@/types/user';

export const userApi = {
  // 获取用户列表
  getUserList: (params?: { page?: number; size?: number }) => {
    return request.get<UserInterface[]>('/users', params);
  },

  // 创建用户
  createUser: (data: Partial<UserInterface>) => {
    return request.post<UserInterface>('/users', data);
  },

  // 更新用户
  updateUser: (id: string, data: Partial<UserInterface>) => {
    return request.put<UserInterface>(`/users/${id}`, data);
  },

  // 删除用户
  deleteUser: (id: string) => {
    return request.delete(`/users/${id}`);
  },
};
```

**3. 在组件中使用**：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userApi } from '@/api/user';
import type { UserInterface } from '@/types/user';

const users = ref<UserInterface[]>([]);

onMounted(async () => {
  try {
    const res = await userApi.getUserList({ page: 1, size: 10 });
    users.value = res.data;
  } catch (error) {
    // 错误已由 request 封装自动处理
    console.error('获取用户列表失败:', error);
  }
});
</script>
```

#### 类型定义规范

- **类型文件位置**: `src/types/` 目录
- **命名规范**: 使用 `Interface` 后缀（如 `UserInterface`）或直接使用描述性名称
- **导出方式**: 使用 `export interface` 或 `export type`
- **导入方式**: 使用 `import type` 进行类型导入（避免运行时导入）

## 📝 开发规范

### 代码风格

1. **使用 Composition API**: 优先使用 `<script setup>` 语法
2. **TypeScript**: 所有 `.vue` 文件使用 `<script setup lang="ts">`
3. **组件命名**: 使用 PascalCase（如 `UserProfile.vue`）
4. **文件命名**: 
   - 组件文件：PascalCase（如 `UserProfile.vue`）
   - 工具文件：camelCase（如 `formatDate.ts`）
   - 常量文件：camelCase（如 `apiConstants.ts`）

### 目录规范

- **组件**: `src/components/` - 全局可复用组件
- **页面**: `src/views/` - 路由对应的页面组件
- **工具函数**: `src/utils/` - 通用工具函数
- **API 请求**: `src/api/` - API 接口模块（按业务模块划分，如 `user.ts`, `product.ts`）
- **类型定义**: `src/types/` - TypeScript 类型定义（与 API 模块对应，如 `user.ts`）

### Git 提交规范

建议使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
perf: 性能优化
test: 测试相关
chore: 构建/工具链相关
```

## 📜 常用命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 构建生产版本（包含类型检查）
pnpm build

# 仅构建（不进行类型检查）
pnpm build-only

# 预览生产构建
pnpm preview

# ESLint 检查并自动修复
pnpm lint

# ESLint 仅检查（不修复）
pnpm lint:check
```

## 👥 团队协作

### 首次拉取项目

1. 克隆仓库
2. 安装依赖：`pnpm install`
3. 创建环境变量文件（参考 [快速开始](#快速开始) 第 3 步）
4. 启动开发服务器：`pnpm dev`

### 代码提交前

1. **运行类型检查**: `pnpm type-check`
2. **运行 ESLint**: `pnpm lint`
3. **确保测试通过**（如有测试）

### 自动生成的文件

以下文件由工具自动生成，**不应手动编辑**：

- `src/auto-imports.d.ts` - 自动导入类型声明
- `src/components.d.ts` - 组件类型声明
- `.eslintrc-auto-import.json` - ESLint 自动导入配置

这些文件会在以下情况自动更新：
- 安装/更新依赖后
- 添加新的自动导入 API 后
- 添加新的全局组件后

### IDE 推荐配置

#### VS Code

推荐安装以下扩展：

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 官方扩展（**必须**）
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) - TypeScript Vue 插件
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - ESLint 支持

> ⚠️ **重要**: 
> - **必须卸载 Vetur 扩展**，因为它与 Volar 冲突，会导致类型错误和功能异常
> - 如果已安装 Vetur，请立即卸载：`Extensions` → 搜索 `Vetur` → `Uninstall`
> - 项目已配置自动禁用 Vetur（`.vscode/settings.json` 和 `.vscode/extensions.json`）

#### 浏览器扩展

- **Chrome/Edge**: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox**: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### 常见问题

#### 1. 类型错误但代码运行正常

**最常见原因：Vetur 与 Volar 冲突**

- ✅ **立即检查**：是否安装了 Vetur 扩展？如果安装了，请**立即卸载**
- 运行 `pnpm type-check` 检查类型
- 确保 `src/auto-imports.d.ts` 和 `src/components.d.ts` 已生成
- 重启 VS Code 或重新加载窗口
- 重启 TypeScript 服务：`Ctrl+Shift+P` → `TypeScript: Restart TS Server`

#### 2. ESLint 报错：未定义的全局变量

- 运行 `pnpm dev` 或 `pnpm build` 重新生成 `.eslintrc-auto-import.json`
- 确保使用了自动导入的 API（如 `ref`, `computed` 等）

#### 3. Element Plus 组件未自动导入

- 检查组件是否在 `src/components` 目录下
- 检查 `vite.config.ts` 中的 `Components` 插件配置
- 重启开发服务器

#### 4. 环境变量不生效

- 确保环境变量文件在项目根目录
- 确保变量名以 `VITE_` 开头
- 重启开发服务器

## 📚 相关文档

- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://cn.vite.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/zh/)
- [Pinia 文档](https://pinia.vuejs.org/zh/)
- [Vue Router 文档](https://router.vuejs.org/zh/)
- [Element Plus 文档](https://element-plus.org/zh-CN/)
- [Axios 文档](https://axios-http.com/zh/)

## 📄 许可证

[根据项目实际情况填写]

---

**Happy Coding! 🎉**
