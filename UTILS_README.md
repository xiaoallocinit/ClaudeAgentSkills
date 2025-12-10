# 工具模块文档

本文档说明 `src/utils/` 和 `src/commands/` 目录下所有模块的功能和使用方法。

## 目录结构

```
src/
├── utils/
│   ├── paths.js      # 路径管理工具
│   ├── fs.js         # 文件系统工具
│   └── display.js    # 终端显示工具
├── commands/
│   ├── list.js       # 列表展示命令
│   ├── info.js       # 详情展示命令
│   ├── install.js    # 安装命令
│   └── uninstall.js  # 卸载命令
└── constants.js      # 常量定义
```

## utils/paths.js - 路径管理工具

### 主要功能
- 生成和管理 Agent 和 Skill 的源路径和安装路径
- 验证路径格式
- 解析路径字符串

### 核心函数

#### `getAgentSourcePath(category, name)`
获取 Agent 源代码路径（项目内）。
```javascript
const path = getAgentSourcePath('specialized', 'vue3-expert');
// 返回: /path/to/project/agents/specialized/vue3-expert
```

#### `getAgentInstallPath(category, name)`
获取 Agent 安装路径（用户目录）。
```javascript
const path = getAgentInstallPath('specialized', 'vue3-expert');
// 返回: ~/.claude/agents/specialized/vue3-expert
```

#### `getSkillSourcePath(category, name)`
获取 Skill 源代码路径（项目内）。
```javascript
const path = getSkillSourcePath('code-generation', 'vue3-component');
// 返回: /path/to/project/skills/code-generation/vue3-component
```

#### `getSkillInstallPath(category, name, isLocal)`
获取 Skill 安装路径。
```javascript
// 全局安装
const globalPath = getSkillInstallPath('code-generation', 'vue3-component', false);
// 返回: ~/.claude/skills/code-generation/vue3-component

// 项目级安装
const localPath = getSkillInstallPath('code-generation', 'vue3-component', true);
// 返回: ./当前目录/.claude/skills/code-generation/vue3-component
```

#### `isValidPath(path)`
验证路径格式是否为 `category/name`。
```javascript
isValidPath('specialized/vue3-expert'); // true
isValidPath('invalid'); // false
isValidPath('a/b/c'); // false
```

#### `parsePath(path)`
解析路径字符串为对象。
```javascript
const result = parsePath('specialized/vue3-expert');
// 返回: { category: 'specialized', name: 'vue3-expert' }
```

---

## utils/fs.js - 文件系统工具

### 主要功能
- 目录和文件操作
- manifest.json 读取和验证
- 安装状态检查
- 文件大小格式化

### 核心函数

#### `ensureDir(dir)`
确保目录存在，不存在则创建。
```javascript
await ensureDir('/path/to/directory');
```

#### `copyDirectory(src, dest, options)`
递归复制目录。
```javascript
await copyDirectory(
  '/source/path',
  '/destination/path',
  { overwrite: true }
);
```

#### `removeDirectory(dir)`
删除目录及其所有内容。
```javascript
await removeDirectory('/path/to/directory');
```

#### `readManifest(dir)`
读取并验证 manifest.json 文件。
```javascript
const manifest = await readManifest('/path/to/agent');
// 返回: { type, name, description, version, category, ... }
```

验证必需字段：
- `type`: 'agent' 或 'skill'
- `name`: 显示名称
- `description`: 描述
- `version`: 版本号
- `category`: 分类

#### `isInstalled(installPath)`
检查指定路径是否已安装（存在且包含 manifest.json）。
```javascript
const installed = await isInstalled('/path/to/installation');
// 返回: true 或 false
```

#### `validateSource(sourcePath, type)`
验证源路径是否存在且有效。
```javascript
const result = await validateSource('/path/to/source', 'agent');
// 返回: { exists: true, valid: true } 或 { exists: false, valid: false, message: '错误信息' }
```

#### `copyFile(src, dest)`
复制单个文件。
```javascript
await copyFile('/source/file.txt', '/dest/file.txt');
```

#### `formatSize(bytes)`
格式化文件大小。
```javascript
formatSize(1024);       // "1.00 KB"
formatSize(1048576);    // "1.00 MB"
formatSize(1073741824); // "1.00 GB"
```

---

## utils/display.js - 终端显示工具

### 主要功能
- 美观的终端输出
- Banner 和标题显示
- 列表和详情展示
- 状态提示和错误信息

### 核心函数

#### `showBanner(version)`
显示项目 Banner。
```javascript
showBanner('1.0.0');
```

#### `showInstallSuccess(type, category, name, location, usage)`
显示安装成功信息框。
```javascript
showInstallSuccess(
  'agent',
  'specialized',
  'vue3-expert',
  '~/.claude/agents/specialized/vue3-expert',
  'claude --agent specialized/vue3-expert'
);
```

#### `showUninstallSuccess(type, category, name)`
显示卸载成功信息。
```javascript
showUninstallSuccess('skill', 'code-generation', 'vue3-component');
```

#### `showError(message)`
显示错误信息。
```javascript
showError('安装失败: 文件不存在');
```

#### `showWarning(message)`
显示警告信息。
```javascript
showWarning('此操作将覆盖已有安装');
```

#### `showInfo(message)`
显示提示信息。
```javascript
showInfo('使用 --yes 参数跳过确认');
```

#### `showSection(title, emoji)`
显示章节标题。
```javascript
showSection('🤖 AGENTS', '');
```

#### `showCategory(title, icon)`
显示分类标题框。
```javascript
showCategory('Specialized', '🔧');
```

#### `showListItem(label, value, status)`
显示列表项。
```javascript
showListItem('vue3-expert', 'Vue 3 开发专家', '●');  // 已安装
showListItem('skill-name', '描述', '○');           // 未安装
showListItem('local-skill', '描述', '[local]');    // 项目级安装
```

#### `showDetails(data)`
显示详情框。
```javascript
showDetails({
  name: 'Vue3 Expert',
  description: 'Vue 3 开发专家',
  version: '1.0.0',
  author: 'Author Name',
  category: 'specialized',
  tags: ['vue3', 'typescript'],
  status: 'installed',
  location: '~/.claude/agents/...'
});
```

---

## commands/list.js - 列表展示命令

### 主要功能
- 列出所有可用的 Agent 和 Skill
- 按分类分组显示
- 显示安装状态

### 核心函数

#### `listAll()`
列出所有 Agent 和 Skill。
```javascript
await listAll();
```

#### `listAgents()`
仅列出 Agent。
```javascript
await listAgents();
```

#### `listSkills()`
仅列出 Skill。
```javascript
await listSkills();
```

#### `getAgentInfo(category, name)`
获取特定 Agent 的信息。
```javascript
const info = await getAgentInfo('specialized', 'vue3-expert');
// 返回: { category, name, manifest, installed, installPath }
```

#### `getSkillInfo(category, name)`
获取特定 Skill 的信息。
```javascript
const info = await getSkillInfo('code-generation', 'vue3-component');
// 返回: { category, name, manifest, globalInstalled, localInstalled, ... }
```

#### `getTemplateCounts()`
统计模板数量。
```javascript
const counts = await getTemplateCounts();
// 返回: { agents: 5, skills: 10, total: 15 }
```

---

## commands/info.js - 详情展示命令

### 主要功能
- 显示 Agent 和 Skill 的详细信息
- 显示兼容性要求
- 显示安装提示

### 核心函数

#### `showAgentInfo(path)`
显示 Agent 详情。
```javascript
await showAgentInfo('specialized/vue3-expert');
```

#### `showSkillInfo(path)`
显示 Skill 详情。
```javascript
await showSkillInfo('code-generation/vue3-component');
```

#### `showProjectInfo(counts)`
显示项目信息和统计。
```javascript
showProjectInfo({ agents: 5, skills: 10, total: 15 });
```

#### `showQuickHelp()`
显示快速帮助信息。
```javascript
showQuickHelp();
```

#### `checkCompatibility(compatibility, currentVersion)`
检查版本兼容性。
```javascript
const result = checkCompatibility(
  { 'claude-code': '>=1.0.0' },
  '1.2.0'
);
// 返回: { compatible: true } 或 { compatible: false, message: '错误信息' }
```

---

## commands/install.js - 安装命令

### 主要功能
- 安装 Agent 和 Skill
- 复制所有必需文件
- 显示安装进度
- 批量安装

### 核心函数

#### `installAgent(path, skipConfirm)`
安装 Agent。
```javascript
const success = await installAgent('specialized/vue3-expert', false);
// 返回: true (成功) 或 false (失败)
```

安装步骤：
1. 验证源路径
2. 创建安装目录
3. 复制 CLAUDE.md
4. 复制 manifest.json
5. 复制附加文件（如有）
6. 显示成功信息

#### `installSkill(path, isLocal, skipConfirm)`
安装 Skill（支持全局和项目级）。
```javascript
// 全局安装
const success = await installSkill('code-generation/vue3-component', false, false);

// 项目级安装
const success = await installSkill('code-generation/vue3-component', true, false);
```

安装步骤：
1. 验证源路径
2. 创建安装目录
3. 复制 SKILL.md
4. 复制 manifest.json
5. 复制 templates 目录（如有）
6. 复制附加文件（如有）
7. 显示成功信息

#### `batchInstall(items, skipConfirm)`
批量安装。
```javascript
const results = await batchInstall([
  { type: 'agent', path: 'specialized/vue3-expert' },
  { type: 'skill', path: 'code-generation/vue3-component', isLocal: false }
], false);
// 返回: { success: 2, failed: 0 }
```

---

## commands/uninstall.js - 卸载命令

### 主要功能
- 卸载 Agent 和 Skill
- 显示卸载进度
- 批量卸载

### 核心函数

#### `uninstallAgent(path, skipConfirm)`
卸载 Agent。
```javascript
const success = await uninstallAgent('specialized/vue3-expert', false);
// 返回: true (成功) 或 false (失败)
```

#### `uninstallSkill(path, isLocal, skipConfirm)`
卸载 Skill。
```javascript
// 卸载全局安装
const success = await uninstallSkill('code-generation/vue3-component', false, false);

// 卸载项目级安装
const success = await uninstallSkill('code-generation/vue3-component', true, false);
```

#### `batchUninstall(items, skipConfirm)`
批量卸载。
```javascript
const results = await batchUninstall([
  { type: 'agent', path: 'specialized/vue3-expert' },
  { type: 'skill', path: 'code-generation/vue3-component', isLocal: false }
], false);
// 返回: { success: 2, failed: 0 }
```

---

## 错误处理

所有函数都包含完善的错误处理：

- **路径验证错误**: 当路径格式不正确时返回友好的错误信息
- **文件操作错误**: 捕获并转换为易读的错误消息
- **manifest 验证错误**: 明确指出缺失的必需字段
- **权限错误**: 提示权限问题并建议解决方案

示例：
```javascript
try {
  await installAgent('invalid-path');
} catch (error) {
  // 错误信息格式: "操作失败: 详细原因"
  console.error(error.message);
}
```

---

## 跨平台支持

所有路径操作使用 Node.js 的 `path` 模块，确保在 Windows、macOS 和 Linux 上正常工作：

```javascript
import { join } from 'path';

// 自动使用正确的路径分隔符
const path = join(basePath, category, name);
```

---

## 测试

运行测试脚本验证所有工具函数：

```bash
node test-utils.js
```

测试内容：
- ✅ 路径验证和解析
- ✅ 路径生成
- ✅ 文件大小格式化
- ✅ 安装状态检查
- ✅ 终端显示效果

---

## 使用示例

### 完整的安装流程

```javascript
import { installAgent } from './src/commands/install.js';

// 1. 安装 Agent（带确认）
await installAgent('specialized/vue3-expert', false);

// 2. 安装 Agent（跳过确认）
await installAgent('specialized/vue3-expert', true);
```

### 完整的列表展示

```javascript
import { listAll, listAgents, listSkills } from './src/commands/list.js';

// 列出所有
await listAll();

// 仅列出 Agents
await listAgents();

// 仅列出 Skills
await listSkills();
```

### 显示详情

```javascript
import { showAgentInfo, showSkillInfo } from './src/commands/info.js';

// 显示 Agent 详情
await showAgentInfo('specialized/vue3-expert');

// 显示 Skill 详情
await showSkillInfo('code-generation/vue3-component');
```

---

## 依赖说明

所有工具模块依赖以下 npm 包：

- `chalk`: 终端颜色和样式
- `boxen`: 终端边框和框架
- `ora`: 加载动画
- `fs-extra`: 增强的文件系统操作
- `commander`: 命令行参数解析（CLI 使用）

所有依赖已在 `package.json` 中定义。

---

## 代码质量

✅ 使用 ES Modules (import/export)
✅ 完整的错误处理
✅ 清晰的代码注释
✅ 函数职责单一
✅ 支持 async/await
✅ 跨平台路径支持
✅ 美观的终端输出

---

## 开发规范

### 命名规范
- 函数名: camelCase (如 `getAgentPath`)
- 常量: UPPER_SNAKE_CASE (如 `AGENT_INSTALL_PATH`)
- 文件名: kebab-case (如 `display.js`)

### 注释规范
每个函数都包含 JSDoc 风格的注释：
```javascript
/**
 * 函数描述
 * @param {string} param1 - 参数1说明
 * @param {boolean} param2 - 参数2说明
 * @returns {Promise<boolean>} 返回值说明
 */
export async function functionName(param1, param2) {
  // 实现
}
```

---

更新日期: 2024-12-09
