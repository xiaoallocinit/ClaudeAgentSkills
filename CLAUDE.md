请帮我创建一个完整的 Claude Code 模板分发项目，使用 GitHub 方式分发（不发布到 npm）。包含 Agents（角色模板）和 Skills（技能模板）两种类型。用户可以通过 npx 命令一键安装到本地。

## 项目需求

### 1. 核心功能

#### Agent 相关命令
- `npx github:xiaoallocinit/ClaudeAgentSkills --agent=<category>/<name>` 安装 agent
- `--list-agents` 或 `-la` 列出所有 agents
- `--info-agent=<path>` 查看 agent 详情
- `--uninstall-agent=<path>` 卸载 agent
- Agent 安装位置：`~/.claude/agents/<category>/<name>/`

#### Skill 相关命令
- `npx github:xiaoallocinit/ClaudeAgentSkills --skill=<category>/<name>` 安装 skill 到全局
- `npx github:xiaoallocinit/ClaudeAgentSkills --skill=<category>/<name> --local` 安装 skill 到当前项目
- `--list-skills` 或 `-ls` 列出所有 skills
- `--info-skill=<path>` 查看 skill 详情
- `--uninstall-skill=<path>` 卸载 skill
- Skill 全局安装位置：`~/.claude/skills/<category>/<name>/`
- Skill 项目级安装位置：`./.claude/skills/<category>/<name>/`

#### 通用命令
- `--list` 或 `-l` 列出所有 agents 和 skills
- `--yes` 或 `-y` 跳过确认
- `--version` 或 `-v` 显示版本
- `--help` 或 `-h` 显示帮助

### 2. 项目结构

```
ClaudeAgentSkills/
├── package.json
├── bin/
│   └── cli.js                    # 主入口
├── src/
│   ├── commands/
│   │   ├── install.js            # 安装逻辑
│   │   ├── uninstall.js          # 卸载逻辑
│   │   ├── list.js               # 列表展示
│   │   └── info.js               # 详情展示
│   ├── utils/
│   │   ├── paths.js              # 路径工具
│   │   ├── fs.js                 # 文件操作
│   │   └── display.js            # 终端显示
│   └── constants.js              # 常量定义
├── agents/                       # Agent 模板目录（示例）
│   └── specialized/
│       └── vue3-expert/
│           ├── CLAUDE.md
│           └── manifest.json
├── skills/                       # Skill 模板目录（示例）
│   └── code-generation/
│       └── vue3-component/
│           ├── SKILL.md
│           ├── manifest.json
│           └── templates/
│               ├── component.vue.template
│               └── composable.ts.template
├── README.md
├── README_CN.md
├── LICENSE
└── .gitignore
```

### 3. package.json

```json
{
  "name": "ClaudeAgentSkills",
  "version": "1.0.0",
  "description": "A collection of Claude Code Agents and Skills templates",
  "main": "bin/cli.js",
  "bin": {
    "claude-agent-skills": "./bin/cli.js"
  },
  "scripts": {
    "test": "node bin/cli.js --list",
    "link": "npm link"
  },
  "files": [
    "bin",
    "src",
    "agents",
    "skills"
  ],
  "keywords": [
    "claude",
    "claude-code",
    "agent",
    "skill",
    "template",
    "ai",
    "anthropic"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/xiaoallocinit/ClaudeAgentSkills.git"
  },
  "dependencies": {
    "chalk": "^5.3.0",
    "commander": "^12.0.0",
    "fs-extra": "^11.2.0",
    "ora": "^8.0.1",
    "boxen": "^7.1.1"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "type": "module"
}
```

### 4. manifest.json 格式

#### Agent manifest.json 格式
```json
{
  "type": "agent",
  "name": "显示名称",
  "description": "中文描述",
  "description_en": "English description",
  "version": "1.0.0",
  "author": "作者",
  "category": "分类目录名",
  "tags": ["标签1", "标签2"],
  "compatibility": {
    "claude-code": ">=1.0.0"
  }
}
```

#### Skill manifest.json 格式
```json
{
  "type": "skill",
  "name": "显示名称",
  "description": "中文描述",
  "description_en": "English description",
  "version": "1.0.0",
  "author": "作者",
  "category": "分类目录名",
  "tags": ["标签1", "标签2"],
  "templates": ["模板文件1", "模板文件2"],
  "compatibility": {
    "claude-code": ">=1.0.0"
  }
}
```

### 5. 示例 Agent: specialized/vue3-expert

#### agents/specialized/vue3-expert/manifest.json

```json
{
  "type": "agent",
  "name": "Vue3 Expert",
  "description": "Vue 3 / UniApp 跨端开发专家，精通 Composition API、TypeScript 和多端适配",
  "description_en": "Vue 3 / UniApp cross-platform development expert",
  "version": "1.0.0",
  "author": "Your Name",
  "category": "specialized",
  "tags": ["vue3", "uniapp", "typescript", "composition-api", "cross-platform"],
  "compatibility": {
    "claude-code": ">=1.0.0"
  }
}
```

#### agents/specialized/vue3-expert/CLAUDE.md

这个文件需要包含完整的 Agent 提示词，至少 200 行，包含以下结构：

```markdown
# Vue3 Expert Agent

> Vue 3 / UniApp 跨端开发专家，专注于现代化前端架构和多端适配方案

## 🎯 角色定义

你是一位资深的 Vue 3 和 UniApp 跨端开发专家...

（详细描述角色定位、专业背景、核心价值）

## 💼 核心职责

1. **Vue 3 架构设计**
   - Composition API 最佳实践
   - 组件设计和复用策略
   - 状态管理方案选型

2. **TypeScript 集成**
   - 类型系统设计
   - 泛型和工具类型
   - 类型安全保障

3. **UniApp 跨端开发**
   - 多端适配策略
   - 条件编译使用
   - 性能优化方案

4. **工程化实践**
   - Vite 配置优化
   - 构建流程设计
   - 自动化测试

## 🛠 技能专长

### Vue 3 核心
- Composition API (ref, reactive, computed, watch)
- 组合式函数 (Composables)
- 依赖注入 (provide/inject)
- Teleport、Suspense 等高级特性
- 自定义指令和插件开发

### 状态管理
- Pinia 状态设计
- 持久化方案
- 模块化组织
- DevTools 调试

### UniApp 开发
- 页面和组件规范
- 生命周期管理
- 条件编译 (#ifdef)
- 原生能力调用
- 小程序分包策略

### 工程化
- Vite 深度配置
- ESLint + Prettier
- Husky + lint-staged
- 自动化部署

## 📋 工作流程

当收到开发任务时，我会按以下流程处理：

1. **需求分析**
   - 理解业务场景和目标
   - 确认技术约束和边界
   - 识别跨端适配需求

2. **方案设计**
   - 组件结构设计
   - 数据流设计
   - 接口定义

3. **代码实现**
   - 遵循 Vue 3 最佳实践
   - 完整的 TypeScript 类型
   - 清晰的代码注释

4. **质量保障**
   - 边界情况处理
   - 错误处理机制
   - 性能优化建议

## 📤 输出规范

### 组件代码规范
- 使用 `<script setup lang="ts">` 语法
- Props 使用 defineProps 配合 TypeScript
- Emits 使用 defineEmits 配合类型定义
- 组件名使用 PascalCase
- 文件名使用 kebab-case

### 类型定义规范
- 接口使用 `I` 前缀或描述性命名
- 类型别名用于联合类型和工具类型
- 导出所有公共类型
- 避免使用 any

### 样式规范
- 使用 scoped 样式
- 支持 CSS 变量主题
- 响应式布局优先
- 遵循 BEM 命名（可选）

## ⚡ 最佳实践

### 组件设计
- 单一职责原则
- Props 向下，Events 向上
- 合理使用 slot 增加灵活性
- 避免过深的组件嵌套

### 性能优化
- 合理使用 v-memo
- 大列表使用虚拟滚动
- 图片懒加载
- 路由懒加载

### UniApp 特有
- 使用 easycom 自动导入
- 合理规划分包
- 注意各端 API 差异
- 善用条件编译

## 🚫 限制与边界

- 不处理后端业务逻辑
- 不涉及数据库设计
- 不提供 UI 设计建议（仅实现）
- 专注于 Vue 3 生态，不涉及 React/Angular

## 💡 使用示例

### 示例 1：创建一个表单组件
用户：帮我创建一个用户注册表单组件，需要有用户名、邮箱、密码字段，支持表单验证。

（给出完整的组件代码示例）

### 示例 2：UniApp 列表页面
用户：帮我写一个商品列表页面，需要支持下拉刷新和上拉加载更多，要兼容 H5 和微信小程序。

（给出完整的页面代码示例）

### 示例 3：Pinia Store 设计
用户：帮我设计一个购物车的 Pinia store，需要支持添加、删除、修改数量，以及本地持久化。

（给出完整的 store 代码示例）
```

### 6. 示例 Skill: code-generation/vue3-component

#### skills/code-generation/vue3-component/manifest.json

```json
{
  "type": "skill",
  "name": "Vue3 Component Generator",
  "description": "Vue 3 组件代码生成技能，包含 Composition API 最佳实践和代码模板",
  "description_en": "Vue 3 component code generation with Composition API best practices",
  "version": "1.0.0",
  "author": "Your Name",
  "category": "code-generation",
  "tags": ["vue3", "component", "typescript", "composition-api"],
  "templates": [
    "component.vue.template",
    "composable.ts.template"
  ],
  "compatibility": {
    "claude-code": ">=1.0.0"
  }
}
```

#### skills/code-generation/vue3-component/SKILL.md

这个文件需要包含完整的 Skill 指南，至少 150 行，包含以下结构：

```markdown
# Vue3 Component Generator Skill

> Vue 3 组件代码生成技能，提供标准化的组件结构和最佳实践指南

## 📋 概述

本技能用于生成符合最佳实践的 Vue 3 组件代码，包括：
- 标准组件结构
- Composition API 使用规范
- TypeScript 类型定义
- 组合式函数 (Composables)

## 🎯 适用场景

- 创建新的 Vue 3 组件
- 重构现有组件为 Composition API
- 创建可复用的组合式函数
- 需要标准化团队组件规范时

## 📁 模板文件说明

### component.vue.template

标准 Vue 3 组件模板，包含：
- `<script setup lang="ts">` 结构
- Props 和 Emits 类型定义
- 生命周期钩子示例
- 响应式数据示例
- scoped 样式区块

### composable.ts.template

组合式函数模板，包含：
- 标准函数结构
- 响应式状态管理
- 生命周期集成
- 返回值类型定义

## 🔧 使用方法

### 生成基础组件

当需要创建一个新组件时，使用以下结构：

```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue'

// 2. 类型定义
interface Props {
  // props 类型
}

interface Emits {
  // emits 类型
}

// 3. Props 和 Emits
const props = withDefaults(defineProps<Props>(), {
  // 默认值
})

const emit = defineEmits<Emits>()

// 4. 响应式状态
const state = ref()

// 5. 计算属性
const computed = computed(() => {})

// 6. 方法
const handleAction = () => {}

// 7. 生命周期
onMounted(() => {})
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 样式 */
</style>
```

### 生成组合式函数

当需要创建可复用逻辑时：

```typescript
import { ref, onMounted, onUnmounted } from 'vue'

interface UseXxxOptions {
  // 配置选项类型
}

interface UseXxxReturn {
  // 返回值类型
}

export function useXxx(options: UseXxxOptions = {}): UseXxxReturn {
  // 响应式状态
  const state = ref()

  // 方法
  const doSomething = () => {}

  // 生命周期
  onMounted(() => {})
  onUnmounted(() => {})

  // 返回
  return {
    state,
    doSomething
  }
}
```

## ✅ 最佳实践

### 命名规范
- 组件文件：PascalCase.vue（如 UserProfile.vue）
- 组合式函数：use 前缀 + camelCase（如 useUserAuth.ts）
- Props：camelCase
- Events：kebab-case

### 组件结构顺序
1. script setup（或 script）
2. template
3. style

### script setup 内部顺序
1. 导入语句
2. 类型定义
3. Props/Emits
4. 组合式函数调用
5. 响应式状态
6. 计算属性
7. 方法
8. 生命周期钩子
9. defineExpose（如需要）

### Props 设计原则
- 必需 props 不设默认值
- 可选 props 提供合理默认值
- 避免过多 props（超过 5 个考虑重构）
- 复杂类型使用 interface 定义

### 事件设计原则
- 使用 kebab-case 命名
- 提供清晰的事件参数类型
- 遵循 update:xxx 模式实现 v-model

## ⚠️ 注意事项

1. **避免在 setup 中使用 this**
   - Composition API 中没有 this 上下文

2. **响应式解构会丢失响应性**
   - 使用 toRefs 或 storeToRefs

3. **注意 ref 和 reactive 的选择**
   - 基础类型用 ref
   - 对象类型可用 reactive
   - 需要整体替换的用 ref

4. **生命周期钩子需要在 setup 同步调用**
   - 不能在异步回调中注册

## 💡 完整示例

### 示例：带搜索的列表组件

（给出完整的组件代码）

### 示例：useFetch 组合式函数

（给出完整的 composable 代码）
```

#### skills/code-generation/vue3-component/templates/component.vue.template

```vue
<script setup lang="ts">
/**
 * @component {{COMPONENT_NAME}}
 * @description {{DESCRIPTION}}
 */

import { ref, computed, onMounted } from 'vue'

// ==================== 类型定义 ====================

interface Props {
  /**
   * 组件属性描述
   */
  title?: string
}

interface Emits {
  (e: 'update', value: string): void
  (e: 'submit'): void
}

// ==================== Props & Emits ====================

const props = withDefaults(defineProps<Props>(), {
  title: '默认标题'
})

const emit = defineEmits<Emits>()

// ==================== 响应式状态 ====================

const inputValue = ref('')
const isLoading = ref(false)

// ==================== 计算属性 ====================

const displayTitle = computed(() => {
  return props.title.toUpperCase()
})

// ==================== 方法 ====================

const handleSubmit = () => {
  emit('update', inputValue.value)
  emit('submit')
}

// ==================== 生命周期 ====================

onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div class="{{COMPONENT_CLASS}}">
    <h2>{{ displayTitle }}</h2>
    <input v-model="inputValue" type="text" />
    <button @click="handleSubmit" :disabled="isLoading">
      提交
    </button>
  </div>
</template>

<style scoped>
.{{COMPONENT_CLASS}} {
  /* 组件样式 */
}
</style>
```

#### skills/code-generation/vue3-component/templates/composable.ts.template

```typescript
/**
 * @composable {{COMPOSABLE_NAME}}
 * @description {{DESCRIPTION}}
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'

// ==================== 类型定义 ====================

export interface {{COMPOSABLE_NAME}}Options {
  /**
   * 初始值
   */
  initialValue?: string
  /**
   * 是否自动执行
   */
  immediate?: boolean
}

export interface {{COMPOSABLE_NAME}}Return {
  /**
   * 数据状态
   */
  data: Ref<string>
  /**
   * 加载状态
   */
  isLoading: Ref<boolean>
  /**
   * 错误信息
   */
  error: Ref<Error | null>
  /**
   * 处理后的数据
   */
  processedData: ComputedRef<string>
  /**
   * 执行方法
   */
  execute: () => Promise<void>
  /**
   * 重置方法
   */
  reset: () => void
}

// ==================== 组合式函数 ====================

export function {{COMPOSABLE_NAME}}(
  options: {{COMPOSABLE_NAME}}Options = {}
): {{COMPOSABLE_NAME}}Return {
  const { initialValue = '', immediate = false } = options

  // ==================== 响应式状态 ====================

  const data = ref(initialValue)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // ==================== 计算属性 ====================

  const processedData = computed(() => {
    return data.value.trim().toUpperCase()
  })

  // ==================== 方法 ====================

  const execute = async () => {
    isLoading.value = true
    error.value = null

    try {
      // 执行异步操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      data.value = 'Loaded data'
    } catch (e) {
      error.value = e as Error
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    data.value = initialValue
    isLoading.value = false
    error.value = null
  }

  // ==================== 生命周期 ====================

  onMounted(() => {
    if (immediate) {
      execute()
    }
  })

  onUnmounted(() => {
    // 清理操作
  })

  // ==================== 返回 ====================

  return {
    data,
    isLoading,
    error,
    processedData,
    execute,
    reset
  }
}
```

### 7. 终端输出效果

#### Banner（每次运行显示）
```
   _____ _                 _        _____           _ _    _ _   
  / ____| |               | |      |_   _|__   ___ | | | _(_) |_ 
 | |    | | __ _ _   _  __| | ___    | |/ _ \ / _ \| | |/ / | __|
 | |____| |/ _` | | | |/ _` |/ _ \   | | (_) | (_) | |   <| | |_ 
  \_____|_|\__,_|\__,_|\__,_|\___/   |_|\___/ \___/|_|_|\_\_|\__|
                                                        v1.0.0
  Agents & Skills for Claude Code
```

#### 列出全部（--list）
```
📦 ClaudeAgentSkills - Available Templates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 AGENTS (Role Templates)

┌─ 🔧 Specialized ──────────────────────────────────────────────┐
│  ○ vue3-expert           Vue3/UniApp 开发专家                 │
└───────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠 SKILLS (Task Templates)

┌─ 💻 Code Generation ──────────────────────────────────────────┐
│  ○ vue3-component        Vue 3 组件生成                       │
└───────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

● = installed globally    ○ = not installed    [local] = project only

Commands:
  --agent=<category>/<name>         Install an agent
  --skill=<category>/<name>         Install a skill globally
  --skill=<category>/<name> --local Install a skill to current project
```

#### 安装成功提示
```
🚀 Installing agent: specialized/vue3-expert

✔ Checking agent...
✔ Creating directory...
✔ Copying CLAUDE.md...
✔ Copying manifest.json...
✔ Installation complete!

╭──────────────────────────────────────────────────────────────╮
│                                                              │
│   ✅ Agent installed successfully!                           │
│                                                              │
│   📍 Location:                                               │
│      ~/.claude/agents/specialized/vue3-expert                │
│                                                              │
│   🚀 Usage:                                                  │
│      claude --agent specialized/vue3-expert                  │
│                                                              │
╰──────────────────────────────────────────────────────────────╯
```

### 8. README.md 内容要求

包含以下章节：
- 项目简介
- Features
- Quick Start（GitHub 方式）
- Commands（所有命令说明）
- Available Agents（表格）
- Available Skills（表格）
- Creating Custom Agent（如何添加新 agent）
- Creating Custom Skill（如何添加新 skill）
- Project Structure（目录结构说明）
- Contributing
- License

### 9. README_CN.md 内容要求

README.md 的中文版本，内容对应。

### 10. 其他文件

#### .gitignore
```
node_modules/
.DS_Store
*.log
.env
.idea/
.vscode/
```

#### LICENSE
MIT License，填入当前年份。

### 11. 代码质量要求

- 使用 ES Modules (import/export)
- 所有异步操作使用 async/await
- 完善的错误处理，友好的错误提示
- 代码注释清晰
- 函数职责单一，模块化设计
- 终端输出美观、层次清晰
- 支持 Windows/macOS/Linux 路径

### 12. 重要说明

1. CLAUDE.md 和 SKILL.md 必须是完整、专业、可直接使用的内容，不要使用占位符或省略
2. CLAUDE.md 至少 200 行有效内容
3. SKILL.md 至少 150 行有效内容
4. 模板文件必须完整可用
5. 安装 skill 时如果有 templates 目录，要一并复制
6. --local 参数只对 skill 有效，agent 只能全局安装
7. 列表显示时要区分已安装和未安装状态

请创建完整的项目，所有文件内容都要完整可用。

---

## 使用说明

1. 创建空文件夹并进入：
```bash
mkdir ClaudeAgentSkills
cd ClaudeAgentSkills
```

2. 打开 Claude Code：
```bash
claude
```

3. 将上面 "提示词内容" 部分发送给 Claude Code

4. 生成后本地测试：
```bash
npm install
npm link
claude-agent-skills --list
claude-agent-skills --agent=specialized/vue3-expert
claude-agent-skills --skill=code-generation/vue3-component
claude-agent-skills --skill=code-generation/vue3-component --local
```

5. 推送到 GitHub：
```bash
git init
git add .
git commit -m "Initial commit: ClaudeAgentSkills with agents and skills"
git remote add origin https://github.com/xiaoallocinit/ClaudeAgentSkills.git
git push -u origin main
```

6. 分享给团队使用：
```bash
# 查看所有模板
npx github:xiaoallocinit/ClaudeAgentSkills --list

# 安装 agent
npx github:xiaoallocinit/ClaudeAgentSkills --agent=specialized/vue3-expert --yes

# 安装 skill（全局）
npx github:xiaoallocinit/ClaudeAgentSkills --skill=code-generation/vue3-component --yes

# 安装 skill（仅当前项目）
npx github:xiaoallocinit/ClaudeAgentSkills --skill=code-generation/vue3-component --local --yes
```

## 后续扩展

添加新的 Agent：
1. 在 `agents/` 目录下创建 `<category>/<name>/` 文件夹
2. 添加 `CLAUDE.md` 和 `manifest.json`

添加新的 Skill：
1. 在 `skills/` 目录下创建 `<category>/<name>/` 文件夹
2. 添加 `SKILL.md` 和 `manifest.json`
3. 如有模板文件，创建 `templates/` 子目录

manifest.json 中的 category 字段要与目录名一致。