/**
 * 终端显示工具模块
 * 提供美观的终端输出功能
 */

import chalk from 'chalk';
import boxen from 'boxen';
import { BANNER, VERSION_SUFFIX } from '../constants.js';

/**
 * 显示项目 Banner
 * @param {string} version - 版本号
 */
export function showBanner(version) {
  console.log(chalk.magenta(BANNER));
  console.log(chalk.cyan.bold(`                                                        v${version}`));
  console.log(chalk.gray(VERSION_SUFFIX));
  console.log();
}

/**
 * 显示安装成功信息
 * @param {string} type - 类型 ('agent' 或 'skill')
 * @param {string} category - 分类
 * @param {string} name - 名称
 * @param {string} location - 安装位置
 * @param {string} usage - 使用方法
 */
export function showInstallSuccess(type, category, name, location, usage) {
  const typeLabel = type === 'agent' ? 'Agent' : 'Skill';
  const emoji = type === 'agent' ? '🤖' : '🛠';

  const message = [
    '',
    chalk.green.bold(`   ✅ ${typeLabel} 安装成功!`),
    '',
    chalk.gray('   📍 安装位置:'),
    `      ${chalk.cyan(location)}`,
    '',
    chalk.gray('   🚀 使用方法:'),
    `      ${chalk.yellow(usage)}`,
    ''
  ].join('\n');

  console.log(
    boxen(message, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green',
      title: `${emoji} ${typeLabel}`,
      titleAlignment: 'center'
    })
  );
}

/**
 * 显示卸载成功信息
 * @param {string} type - 类型 ('agent' 或 'skill')
 * @param {string} category - 分类
 * @param {string} name - 名称
 */
export function showUninstallSuccess(type, category, name) {
  const typeLabel = type === 'agent' ? 'Agent' : 'Skill';
  const path = `${category}/${name}`;

  console.log();
  console.log(chalk.green(`✅ ${typeLabel} 已成功卸载: ${chalk.cyan(path)}`));
  console.log();
}

/**
 * 显示错误信息
 * @param {string} message - 错误消息
 */
export function showError(message) {
  console.log();
  console.log(chalk.red(`❌ 错误: ${message}`));
  console.log();
}

/**
 * 显示警告信息
 * @param {string} message - 警告消息
 */
export function showWarning(message) {
  console.log();
  console.log(chalk.yellow(`⚠️  警告: ${message}`));
  console.log();
}

/**
 * 显示信息提示
 * @param {string} message - 信息内容
 */
export function showInfo(message) {
  console.log();
  console.log(chalk.blue(`ℹ️  ${message}`));
  console.log();
}

/**
 * 显示分隔线
 * @param {string} char - 分隔符字符
 * @param {number} length - 长度
 */
export function showDivider(char = '━', length = 70) {
  console.log(chalk.gray(char.repeat(length)));
}

/**
 * 显示章节标题
 * @param {string} title - 标题文本
 * @param {string} emoji - 表情符号
 */
export function showSection(title, emoji = '') {
  console.log();
  console.log(chalk.bold(`${emoji} ${title}`.trim()));
  showDivider();
}

/**
 * 显示列表项
 * @param {string} label - 标签
 * @param {string} value - 值
 * @param {string} status - 状态符号
 */
export function showListItem(label, value, status = '○') {
  const statusColor = status === '●' ? 'green' : status === '[local]' ? 'cyan' : 'gray';
  const statusText = chalk[statusColor](status.padEnd(8));
  const labelText = chalk.white(label.padEnd(20));
  const valueText = chalk.gray(value);

  console.log(`  ${statusText} ${labelText} ${valueText}`);
}

/**
 * 显示类别标题
 * @param {string} title - 类别名称
 * @param {string} icon - 图标
 */
export function showCategory(title, icon = '') {
  console.log();
  console.log(chalk.cyan.bold(`┌─ ${icon} ${title} `).padEnd(72, '─') + '┐');
}

/**
 * 显示类别结尾
 */
export function showCategoryEnd() {
  console.log(chalk.cyan('└' + '─'.repeat(70) + '┘'));
}

/**
 * 显示详情框
 * @param {Object} data - 详情数据
 */
export function showDetails(data) {
  const lines = [];

  if (data.name) {
    lines.push(chalk.white.bold(`名称: `) + chalk.cyan(data.name));
  }

  if (data.description) {
    lines.push(chalk.white.bold(`描述: `) + chalk.gray(data.description));
  }

  if (data.version) {
    lines.push(chalk.white.bold(`版本: `) + chalk.yellow(data.version));
  }

  if (data.author) {
    lines.push(chalk.white.bold(`作者: `) + chalk.gray(data.author));
  }

  if (data.category) {
    lines.push(chalk.white.bold(`分类: `) + chalk.cyan(data.category));
  }

  if (data.tags && data.tags.length > 0) {
    const tags = data.tags.map(tag => chalk.magenta(`#${tag}`)).join(' ');
    lines.push(chalk.white.bold(`标签: `) + tags);
  }

  if (data.status !== undefined) {
    const statusText = data.status === 'installed' ? chalk.green('✓ 已安装') : chalk.gray('○ 未安装');
    lines.push(chalk.white.bold(`状态: `) + statusText);
  }

  if (data.location) {
    lines.push(chalk.white.bold(`位置: `) + chalk.gray(data.location));
  }

  console.log(
    boxen(lines.join('\n'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    })
  );
}

/**
 * 显示帮助信息
 * @param {Array<{command: string, description: string}>} commands - 命令列表
 */
export function showHelp(commands) {
  console.log();
  console.log(chalk.bold('可用命令:'));
  console.log();

  const maxLength = Math.max(...commands.map(cmd => cmd.command.length));

  commands.forEach(({ command, description }) => {
    const paddedCommand = command.padEnd(maxLength + 2);
    console.log(`  ${chalk.cyan(paddedCommand)} ${chalk.gray(description)}`);
  });

  console.log();
}

/**
 * 显示列表头部
 * @param {string} title - 标题
 */
export function showListHeader(title) {
  console.log();
  console.log(chalk.bold.white(title));
  console.log();
  showDivider();
}

/**
 * 显示列表尾部说明
 */
export function showListFooter() {
  console.log();
  showDivider();
  console.log();
  console.log(chalk.gray('  ● = 已全局安装    ○ = 未安装    [local] = 仅项目级安装'));
  console.log();
  console.log(chalk.gray('命令:'));
  console.log(chalk.gray('  --agent=<category>/<name>         安装 agent'));
  console.log(chalk.gray('  --skill=<category>/<name>         全局安装 skill'));
  console.log(chalk.gray('  --skill=<category>/<name> --local 项目级安装 skill'));
  console.log();
}

/**
 * 显示加载进度(简单版)
 * @param {string} message - 进度消息
 */
export function showProgress(message) {
  console.log(chalk.cyan(`  ⏳ ${message}...`));
}

/**
 * 显示成功标记
 * @param {string} message - 成功消息
 */
export function showSuccess(message) {
  console.log(chalk.green(`  ✓ ${message}`));
}

/**
 * 创建一个简单的表格显示
 * @param {Array<Object>} rows - 表格行数据
 * @param {Array<string>} headers - 表头
 */
export function showTable(rows, headers) {
  if (rows.length === 0) {
    console.log(chalk.gray('  (空)'));
    return;
  }

  // 计算每列的最大宽度
  const columnWidths = headers.map((header, index) => {
    const maxContentLength = Math.max(
      ...rows.map(row => String(row[index] || '').length)
    );
    return Math.max(header.length, maxContentLength);
  });

  // 显示表头
  const headerRow = headers
    .map((header, index) => chalk.cyan(header.padEnd(columnWidths[index])))
    .join('  ');
  console.log(`  ${headerRow}`);
  console.log(chalk.gray('  ' + columnWidths.map(w => '─'.repeat(w)).join('  ')));

  // 显示数据行
  rows.forEach(row => {
    const dataRow = row
      .map((cell, index) => String(cell).padEnd(columnWidths[index]))
      .join('  ');
    console.log(`  ${dataRow}`);
  });
}

/**
 * 询问用户确认
 * @param {string} message - 确认消息
 * @returns {Promise<boolean>} 用户是否确认
 */
export async function confirm(message) {
  // 注意: 这是一个简化版本,实际项目中应使用 inquirer 或类似库
  // 这里返回 true 表示默认确认
  console.log(chalk.yellow(`  ? ${message} (y/N)`));
  return true;
}
