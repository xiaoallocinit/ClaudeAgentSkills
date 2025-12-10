# Claude Toolkit

> Claude Code Agents 和 Skills 模板集合，提升开发效率

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## 📖 项目简介

Claude Toolkit 是一个完整的 **Agents**（角色模板）和 **Skills**（技能模板）集合，专为 Claude Code 打造。通过一行命令即可安装模板，立即开始高效开发。

### 包含什么？

- **🤖 Agents**: 预配置的 AI 角色模板（Vue3 专家、UI/UX 设计师等）
- **🛠 Skills**: 可复用的代码生成模板和工作流程（组件生成器、测试构建器等）
- **📦 一键安装**: 通过 `npx` 全局或按项目安装模板
- **🔄 跨平台**: 完美支持 Windows、macOS 和 Linux

## ✨ 核心特性

- ⚡ **零配置** - 使用 npx 开箱即用
- 🎯 **角色模板** - 针对不同开发场景的专业化 Agents
- 🧩 **模块化技能** - 灵活组合代码生成模板
- 🌍 **全局与本地安装** - 支持全局复用或项目级安装
- 📝 **完整 TypeScript 支持** - 所有模板包含完善的类型定义
- 🎨 **美观 CLI** - 直观的命令行界面和彩色输出

## 🚀 快速开始

### 使用 npx（推荐）

无需安装，直接从 GitHub 使用：

```bash
# 列出所有可用模板
npx github:xiaoallocinit/ClaudeAgentSkills --list

# 安装一个 Agent
npx github:xiaoallocinit/ClaudeAgentSkills --agent=specialized/vue3-expert

# 全局安装一个 Skill
npx github:xiaoallocinit/ClaudeAgentSkills --skill=code-generation/vue3-component

# 安装 Skill 到当前项目
npx github:xiaoallocinit/ClaudeAgentSkills --skill=code-generation/vue3-component --local
```

### 本地安装

如果需要克隆和修改：

```bash
# 克隆仓库
git clone https://github.com/xiaoallocinit/ClaudeAgentSkills.git
cd ClaudeAgentSkills

# 安装依赖
npm install

# 本地链接
npm link

# 现在可以作为命令使用
claude-toolkit --list
```

## 📋 可用模板

### 🤖 Agents（角色模板）

| 分类 | 名称 | 描述 |
|------|------|------|
| specialized | vue3-expert | Vue 3 / UniApp 跨端开发专家，精通 Composition API、TypeScript 和多端适配 |

### 🛠 Skills（技能模板）

| 分类 | 名称 | 描述 |
|------|------|------|
| code-generation | vue3-component | Vue 3 组件代码生成技能，包含 Composition API 最佳实践和代码模板 |

## 💻 命令说明

### Agent 相关命令

```bash
# 安装 Agent
--agent <分类>/<名称>

# 列出所有 Agents
--list-agents
-la

# 查看 Agent 详情
--info-agent <分类>/<名称>

# 卸载 Agent
--uninstall-agent <分类>/<名称>
```

### Skill 相关命令

```bash
# 全局安装 Skill
--skill <分类>/<名称>

# 安装 Skill 到当前项目
--skill <分类>/<名称> --local

# 列出所有 Skills
--list-skills
-ls

# 查看 Skill 详情
--info-skill <分类>/<名称>

# 卸载 Skill（全局）
--uninstall-skill <分类>/<名称>

# 卸载 Skill（项目）
--uninstall-skill <分类>/<名称> --local
```

### 通用命令

```bash
# 列出所有模板
--list
-l

# 跳过确认提示
--yes
-y

# 显示版本
--version
-v

# 显示帮助
--help
-h
```

## 📂 安装位置

### Agents
- **全局**: `~/.claude/agents/<分类>/<名称>/`

### Skills
- **全局**: `~/.claude/skills/<分类>/<名称>/`
- **项目**: `./.claude/skills/<分类>/<名称>/`

## 🔧 使用示例

### 示例 1: Vue3 开发环境设置

```bash
# 安装 Vue3 Expert Agent
npx github:xiaoallocinit/ClaudeAgentSkills --agent=specialized/vue3-expert --yes

# 安装 Vue3 组件生成器 Skill
npx github:xiaoallocinit/ClaudeAgentSkills --skill=code-generation/vue3-component --yes

# 现在 Claude Code 拥有了 Vue3 专业知识和组件模板！
```

### 示例 2: 项目专属 Skills

```bash
# 进入你的项目
cd my-project

# 仅为此项目本地安装 Skill
npx github:xiaoallocinit/ClaudeAgentSkills --skill=code-generation/vue3-component --local --yes
```

## 🎓 创建自定义模板

### 添加新的 Agent

1. 创建目录结构：
   ```
   agents/<分类>/<名称>/
   ├── manifest.json
   └── CLAUDE.md
   ```

2. 定义 `manifest.json`：
   ```json
   {
     "type": "agent",
     "name": "显示名称",
     "description": "Agent 描述",
     "description_en": "English description",
     "version": "1.0.0",
     "author": "作者名",
     "category": "分类名",
     "tags": ["标签1", "标签2"],
     "compatibility": {
       "claude-code": ">=1.0.0"
     }
   }
   ```

3. 编写 `CLAUDE.md` Agent 指令文件

### 添加新的 Skill

1. 创建目录结构：
   ```
   skills/<分类>/<名称>/
   ├── manifest.json
   ├── SKILL.md
   └── templates/
       ├── template1.template
       └── template2.template
   ```

2. 定义 `manifest.json`：
   ```json
   {
     "type": "skill",
     "name": "显示名称",
     "description": "Skill 描述",
     "description_en": "English description",
     "version": "1.0.0",
     "author": "作者名",
     "category": "分类名",
     "tags": ["标签1", "标签2"],
     "templates": ["template1.template", "template2.template"],
     "compatibility": {
       "claude-code": ">=1.0.0"
     }
   }
   ```

3. 编写 `SKILL.md` 使用说明
4. 在 `templates/` 目录创建模板文件

## 🏗 项目结构

```
claude-toolkit/
├── bin/
│   └── cli.js                    # CLI 入口
├── src/
│   ├── commands/
│   │   ├── install.js            # 安装逻辑
│   │   ├── uninstall.js          # 卸载逻辑
│   │   ├── list.js               # 列表展示
│   │   └── info.js               # 详情展示
│   ├── utils/
│   │   ├── paths.js              # 路径工具
│   │   ├── fs.js                 # 文件系统操作
│   │   └── display.js            # 终端显示
│   └── constants.js              # 常量定义
├── agents/                       # Agent 模板
│   └── specialized/
│       └── vue3-expert/
│           ├── CLAUDE.md
│           └── manifest.json
├── skills/                       # Skill 模板
│   └── code-generation/
│       └── vue3-component/
│           ├── SKILL.md
│           ├── manifest.json
│           └── templates/
├── package.json
├── README.md
└── LICENSE
```

## 🤝 贡献指南

欢迎贡献！以下是参与方式：

1. **Fork** 本仓库
2. **创建** 新分支 (`git checkout -b feature/amazing-template`)
3. **提交** 更改 (`git commit -m 'Add amazing template'`)
4. **推送** 到分支 (`git push origin feature/amazing-template`)
5. **开启** Pull Request

### 贡献要求

- 确保代码风格一致
- 为新功能添加测试
- 更新相关文档
- 提交前确保所有测试通过

## 📄 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 为 Anthropic 的 [Claude Code](https://claude.com/claude-code) 而构建
- 受 Claude AI 社区启发
- 感谢所有贡献者

## 📬 联系方式

- **问题反馈**: [GitHub Issues](https://github.com/xiaoallocinit/ClaudeAgentSkills/issues)
- **讨论交流**: [GitHub Discussions](https://github.com/xiaoallocinit/ClaudeAgentSkills/discussions)

---

**用 ❤️ 为 Claude Code 社区打造**
