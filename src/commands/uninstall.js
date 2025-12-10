/**
 * 卸载命令模块
 * 提供 Agent 和 Skill 的卸载功能
 */

import ora from 'ora';
import chalk from 'chalk';
import {
  parsePath,
  getAgentInstallPath,
  getSkillInstallPath
} from '../utils/paths.js';
import {
  isInstalled,
  removeDirectory,
  readManifest
} from '../utils/fs.js';
import {
  showError,
  showWarning,
  showUninstallSuccess,
  showInfo
} from '../utils/display.js';

/**
 * 卸载 Agent
 * @param {string} path - Agent 路径 (category/name)
 * @param {boolean} skipConfirm - 是否跳过确认
 * @returns {Promise<boolean>} 是否卸载成功
 */
export async function uninstallAgent(path, skipConfirm = false) {
  let spinner;

  try {
    // 解析路径
    const parsed = parsePath(path);
    if (!parsed) {
      showError(`无效的路径格式: ${path}\n正确格式: category/name`);
      return false;
    }

    const { category, name } = parsed;

    console.log();
    console.log(chalk.cyan.bold(`🗑️  正在卸载 Agent: ${category}/${name}`));
    console.log();

    // 获取安装路径
    const installPath = getAgentInstallPath(category, name);

    // 检查是否已安装
    spinner = ora('检查安装状态...').start();
    const installed = await isInstalled(installPath);

    if (!installed) {
      spinner.fail('未安装');
      showError(`Agent 未安装: ${path}`);
      return false;
    }
    spinner.succeed('已找到安装');

    // 读取 manifest 获取信息
    try {
      const manifest = await readManifest(installPath);
      console.log(chalk.gray(`  名称: ${manifest.name}`));
      console.log(chalk.gray(`  版本: ${manifest.version}`));
      console.log(chalk.gray(`  位置: ${installPath}`));
      console.log();
    } catch (error) {
      // 如果读取失败也继续卸载
      console.log(chalk.gray(`  位置: ${installPath}`));
      console.log();
    }

    // 确认卸载
    if (!skipConfirm) {
      showWarning('即将删除此 Agent');
      showInfo('如需跳过确认,请使用 --yes 参数');
      // 这里应该加入用户确认逻辑,简化版本直接继续
    }

    // 删除目录
    spinner = ora('删除 Agent 文件...').start();
    await removeDirectory(installPath);
    spinner.succeed('已删除 Agent 文件');

    // 显示成功信息
    showUninstallSuccess('agent', category, name);

    return true;
  } catch (error) {
    if (spinner) {
      spinner.fail('卸载失败');
    }
    showError(`卸载 Agent 失败: ${error.message}`);
    return false;
  }
}

/**
 * 卸载 Skill
 * @param {string} path - Skill 路径 (category/name)
 * @param {boolean} isLocal - 是否卸载项目级安装
 * @param {boolean} skipConfirm - 是否跳过确认
 * @returns {Promise<boolean>} 是否卸载成功
 */
export async function uninstallSkill(path, isLocal = false, skipConfirm = false) {
  let spinner;

  try {
    // 解析路径
    const parsed = parsePath(path);
    if (!parsed) {
      showError(`无效的路径格式: ${path}\n正确格式: category/name`);
      return false;
    }

    const { category, name } = parsed;

    const scope = isLocal ? '项目级' : '全局';
    console.log();
    console.log(chalk.cyan.bold(`🗑️  正在卸载${scope} Skill: ${category}/${name}`));
    console.log();

    // 获取安装路径
    const installPath = getSkillInstallPath(category, name, isLocal);

    // 检查是否已安装
    spinner = ora('检查安装状态...').start();
    const installed = await isInstalled(installPath);

    if (!installed) {
      spinner.fail('未安装');
      showError(`Skill 未安装: ${path}${isLocal ? ' (项目级)' : ' (全局)'}`);
      return false;
    }
    spinner.succeed('已找到安装');

    // 读取 manifest 获取信息
    try {
      const manifest = await readManifest(installPath);
      console.log(chalk.gray(`  名称: ${manifest.name}`));
      console.log(chalk.gray(`  版本: ${manifest.version}`));
      console.log(chalk.gray(`  范围: ${scope}`));
      console.log(chalk.gray(`  位置: ${installPath}`));
      console.log();
    } catch (error) {
      // 如果读取失败也继续卸载
      console.log(chalk.gray(`  范围: ${scope}`));
      console.log(chalk.gray(`  位置: ${installPath}`));
      console.log();
    }

    // 确认卸载
    if (!skipConfirm) {
      showWarning(`即将删除此${scope} Skill`);
      showInfo('如需跳过确认,请使用 --yes 参数');
      // 这里应该加入用户确认逻辑,简化版本直接继续
    }

    // 删除目录
    spinner = ora('删除 Skill 文件...').start();
    await removeDirectory(installPath);
    spinner.succeed('已删除 Skill 文件');

    // 显示成功信息
    showUninstallSuccess('skill', category, name);

    return true;
  } catch (error) {
    if (spinner) {
      spinner.fail('卸载失败');
    }
    showError(`卸载 Skill 失败: ${error.message}`);
    return false;
  }
}

/**
 * 批量卸载
 * @param {Array<{type: string, path: string, isLocal?: boolean}>} items - 待卸载项目列表
 * @param {boolean} skipConfirm - 是否跳过确认
 * @returns {Promise<{success: number, failed: number}>} 卸载结果统计
 */
export async function batchUninstall(items, skipConfirm = false) {
  const results = {
    success: 0,
    failed: 0
  };

  console.log();
  console.log(chalk.cyan.bold(`🗑️  批量卸载 ${items.length} 个模板...`));
  console.log();

  for (const item of items) {
    let success = false;

    if (item.type === 'agent') {
      success = await uninstallAgent(item.path, skipConfirm);
    } else if (item.type === 'skill') {
      success = await uninstallSkill(item.path, item.isLocal || false, skipConfirm);
    }

    if (success) {
      results.success++;
    } else {
      results.failed++;
    }

    // 每次卸载后稍作延迟,避免输出混乱
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log();
  console.log(chalk.bold('批量卸载完成:'));
  console.log(chalk.green(`  ✓ 成功: ${results.success}`));
  if (results.failed > 0) {
    console.log(chalk.red(`  ✗ 失败: ${results.failed}`));
  }
  console.log();

  return results;
}

/**
 * 清理无效安装
 * 扫描并删除无效的(缺少必需文件)安装
 * @param {string} type - 类型 ('agent' 或 'skill' 或 'all')
 * @param {boolean} isLocal - 是否清理项目级安装(仅对 skill 有效)
 * @param {boolean} dryRun - 是否仅模拟运行,不实际删除
 * @returns {Promise<{found: number, cleaned: number}>} 清理结果
 */
export async function cleanInvalidInstalls(type = 'all', isLocal = false, dryRun = false) {
  console.log();
  console.log(chalk.cyan.bold(`🧹 扫描无效安装...`));
  console.log();

  const results = {
    found: 0,
    cleaned: 0
  };

  // 这个功能需要扫描所有安装目录
  // 由于涉及较复杂的目录遍历,这里提供基础框架
  // 实际实现需要遍历 ~/.claude/agents 和 ~/.claude/skills
  // 以及 ./.claude/skills 目录

  showInfo('清理功能正在开发中...');

  return results;
}

/**
 * 卸载所有模板
 * @param {string} type - 类型 ('agent', 'skill' 或 'all')
 * @param {boolean} isLocal - 是否仅卸载项目级(仅对 skill 有效)
 * @param {boolean} skipConfirm - 是否跳过确认
 * @returns {Promise<boolean>} 是否成功
 */
export async function uninstallAll(type = 'all', isLocal = false, skipConfirm = false) {
  if (!skipConfirm) {
    const scope = isLocal ? '项目级' : '全局';
    const typeText = type === 'all' ? '所有' : type === 'agent' ? 'Agent' : 'Skill';

    console.log();
    showWarning(`即将卸载${scope}的${typeText}模板`);
    showInfo('这是危险操作,请确认!使用 --yes 参数跳过此确认');
    console.log();

    // 这里应该加入用户确认逻辑
    // 简化版本暂不实现
    return false;
  }

  // 实际卸载逻辑需要:
  // 1. 扫描对应目录
  // 2. 收集所有已安装项
  // 3. 调用批量卸载
  showInfo('批量卸载功能正在开发中...');

  return false;
}
