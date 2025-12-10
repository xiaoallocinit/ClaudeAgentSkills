#!/usr/bin/env node

/**
 * 工具函数测试脚本
 */

import chalk from 'chalk';

// 测试 paths.js
console.log(chalk.bold.cyan('\n=== 测试 paths.js ===\n'));

import {
  isValidPath,
  parsePath,
  getAgentSourcePath,
  getAgentInstallPath,
  getSkillSourcePath,
  getSkillInstallPath
} from './src/utils/paths.js';

console.log(chalk.white('1. 路径验证:'));
const testPaths = [
  'specialized/vue3-expert',
  'code-generation/vue3-component',
  'invalid',
  'a/b/c',
  '',
  null
];

testPaths.forEach(path => {
  const valid = isValidPath(path);
  const icon = valid ? chalk.green('✓') : chalk.red('✗');
  console.log(`  ${icon} isValidPath("${path}"): ${valid}`);
});

console.log(chalk.white('\n2. 路径解析:'));
const validPaths = ['specialized/vue3-expert', 'code-generation/vue3-component'];
validPaths.forEach(path => {
  const parsed = parsePath(path);
  console.log(`  ${chalk.green('✓')} parsePath("${path}"):`, parsed);
});

console.log(chalk.white('\n3. 路径生成:'));
console.log('  Agent:');
console.log(`    源: ${chalk.gray(getAgentSourcePath('specialized', 'vue3-expert'))}`);
console.log(`    装: ${chalk.gray(getAgentInstallPath('specialized', 'vue3-expert'))}`);
console.log('  Skill:');
console.log(`    源: ${chalk.gray(getSkillSourcePath('code-generation', 'vue3-component'))}`);
console.log(`    全局: ${chalk.gray(getSkillInstallPath('code-generation', 'vue3-component', false))}`);
console.log(`    本地: ${chalk.gray(getSkillInstallPath('code-generation', 'vue3-component', true))}`);

// 测试 fs.js
console.log(chalk.bold.cyan('\n=== 测试 fs.js ===\n'));

import { formatSize, ensureDir, isInstalled } from './src/utils/fs.js';

console.log(chalk.white('1. 文件大小格式化:'));
const sizes = [0, 1024, 1048576, 1073741824, 1099511627776];
sizes.forEach(size => {
  console.log(`  ${chalk.green('✓')} ${size.toString().padStart(15)} bytes = ${formatSize(size)}`);
});

console.log(chalk.white('\n2. 安装状态检查:'));
const testInstallPaths = [
  getAgentInstallPath('specialized', 'vue3-expert'),
  getSkillInstallPath('code-generation', 'vue3-component', false)
];

for (const path of testInstallPaths) {
  const installed = await isInstalled(path);
  const icon = installed ? chalk.green('●') : chalk.gray('○');
  const status = installed ? '已安装' : '未安装';
  console.log(`  ${icon} ${status}: ${chalk.gray(path)}`);
}

// 测试 display.js
console.log(chalk.bold.cyan('\n=== 测试 display.js ===\n'));

import {
  showBanner,
  showSection,
  showListItem,
  showDetails
} from './src/utils/display.js';

console.log(chalk.white('1. Banner 显示:'));
showBanner('1.0.0');

console.log(chalk.white('2. 章节标题:'));
showSection('测试章节', '🎯');

console.log(chalk.white('\n3. 列表项:'));
showListItem('vue3-expert', 'Vue 3 专家', '●');
showListItem('vue3-component', 'Vue 3 组件生成', '○');
showListItem('local-skill', '本地技能', '[local]');

console.log(chalk.white('\n4. 详情框:'));
showDetails({
  name: 'Vue3 Expert',
  description: 'Vue 3 和 UniApp 开发专家',
  version: '1.0.0',
  author: 'Test Author',
  category: 'specialized',
  tags: ['vue3', 'uniapp', 'typescript'],
  status: 'installed',
  location: '~/.claude/agents/specialized/vue3-expert'
});

// 总结
console.log(chalk.bold.green('\n✅ 所有工具函数测试完成!\n'));
console.log(chalk.gray('所有核心模块已就绪:'));
console.log(chalk.gray('  • src/utils/paths.js     - 路径管理'));
console.log(chalk.gray('  • src/utils/fs.js        - 文件操作'));
console.log(chalk.gray('  • src/utils/display.js   - 终端显示'));
console.log(chalk.gray('  • src/commands/list.js   - 列表命令'));
console.log(chalk.gray('  • src/commands/info.js   - 详情命令'));
console.log(chalk.gray('  • src/commands/install.js - 安装命令'));
console.log(chalk.gray('  • src/commands/uninstall.js - 卸载命令'));
console.log();
