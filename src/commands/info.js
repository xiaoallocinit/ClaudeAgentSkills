/**
 * 详情展示命令模块
 * 提供 Agent 和 Skill 的详细信息展示功能
 */

import chalk from 'chalk';
import { parsePath } from '../utils/paths.js';
import { showDetails, showError, showInfo } from '../utils/display.js';
import { getAgentInfo, getSkillInfo } from './list.js';

/**
 * 显示 Agent 详情
 * @param {string} path - Agent 路径 (category/name)
 * @returns {Promise<void>}
 */
export async function showAgentInfo(path) {
  try {
    // 解析路径
    const parsed = parsePath(path);
    if (!parsed) {
      showError(`无效的路径格式: ${path}\n正确格式: category/name`);
      return;
    }

    const { category, name } = parsed;

    // 获取 Agent 信息
    const agentInfo = await getAgentInfo(category, name);

    if (!agentInfo) {
      showError(`未找到 Agent: ${path}`);
      return;
    }

    const { manifest, installed, installPath } = agentInfo;

    // 准备显示数据
    const displayData = {
      name: manifest.name,
      description: manifest.description || manifest.description_en,
      version: manifest.version,
      author: manifest.author,
      category: manifest.category,
      tags: manifest.tags || [],
      status: installed ? 'installed' : 'not-installed',
      location: installed ? installPath : '未安装'
    };

    console.log();
    console.log(chalk.bold.cyan(`🤖 Agent 详情: ${category}/${name}`));
    console.log();

    showDetails(displayData);

    // 显示兼容性信息
    if (manifest.compatibility) {
      console.log(chalk.gray('  兼容性要求:'));
      Object.entries(manifest.compatibility).forEach(([key, value]) => {
        console.log(chalk.gray(`    ${key}: ${value}`));
      });
      console.log();
    }

    // 显示使用提示
    if (!installed) {
      console.log(chalk.yellow('  💡 安装提示:'));
      console.log(chalk.gray(`      npx claude-toolkit --agent=${category}/${name}`));
      console.log();
    } else {
      console.log(chalk.green('  ✅ 已安装,可在 Claude Code 中使用'));
      console.log();
    }
  } catch (error) {
    showError(`显示 Agent 详情失败: ${error.message}`);
    throw error;
  }
}

/**
 * 显示 Skill 详情
 * @param {string} path - Skill 路径 (category/name)
 * @returns {Promise<void>}
 */
export async function showSkillInfo(path) {
  try {
    // 解析路径
    const parsed = parsePath(path);
    if (!parsed) {
      showError(`无效的路径格式: ${path}\n正确格式: category/name`);
      return;
    }

    const { category, name } = parsed;

    // 获取 Skill 信息
    const skillInfo = await getSkillInfo(category, name);

    if (!skillInfo) {
      showError(`未找到 Skill: ${path}`);
      return;
    }

    const { manifest, globalInstalled, localInstalled, globalInstallPath, localInstallPath } = skillInfo;

    // 确定状态和位置
    let status = 'not-installed';
    let location = '未安装';

    if (globalInstalled) {
      status = 'installed';
      location = `全局: ${globalInstallPath}`;
    } else if (localInstalled) {
      status = 'installed';
      location = `本地: ${localInstallPath}`;
    }

    // 准备显示数据
    const displayData = {
      name: manifest.name,
      description: manifest.description || manifest.description_en,
      version: manifest.version,
      author: manifest.author,
      category: manifest.category,
      tags: manifest.tags || [],
      status,
      location
    };

    console.log();
    console.log(chalk.bold.cyan(`🛠 Skill 详情: ${category}/${name}`));
    console.log();

    showDetails(displayData);

    // 显示模板文件
    if (manifest.templates && manifest.templates.length > 0) {
      console.log(chalk.gray('  📄 包含模板:'));
      manifest.templates.forEach(template => {
        console.log(chalk.gray(`    • ${template}`));
      });
      console.log();
    }

    // 显示兼容性信息
    if (manifest.compatibility) {
      console.log(chalk.gray('  兼容性要求:'));
      Object.entries(manifest.compatibility).forEach(([key, value]) => {
        console.log(chalk.gray(`    ${key}: ${value}`));
      });
      console.log();
    }

    // 显示使用提示
    if (!globalInstalled && !localInstalled) {
      console.log(chalk.yellow('  💡 安装提示:'));
      console.log(chalk.gray('      全局安装:'));
      console.log(chalk.gray(`        npx claude-toolkit --skill=${category}/${name}`));
      console.log(chalk.gray('      项目级安装:'));
      console.log(chalk.gray(`        npx claude-toolkit --skill=${category}/${name} --local`));
      console.log();
    } else {
      console.log(chalk.green('  ✅ 已安装,可在 Claude Code 中使用'));
      console.log();
    }
  } catch (error) {
    showError(`显示 Skill 详情失败: ${error.message}`);
    throw error;
  }
}

/**
 * 显示项目信息和统计
 * @param {Object} counts - 模板数量统计
 */
export function showProjectInfo(counts) {
  console.log();
  console.log(chalk.bold.white('📦 Claude Toolkit'));
  console.log();
  console.log(chalk.gray('  Agent 和 Skill 模板分发工具'));
  console.log();
  console.log(chalk.cyan(`  🤖 Agents: ${counts.agents}`));
  console.log(chalk.cyan(`  🛠 Skills: ${counts.skills}`));
  console.log(chalk.cyan(`  📊 总计: ${counts.total}`));
  console.log();
}

/**
 * 显示快速帮助信息
 */
export function showQuickHelp() {
  console.log();
  console.log(chalk.bold('📖 快速帮助'));
  console.log();
  console.log(chalk.gray('  查看所有模板:'));
  console.log(chalk.cyan('    --list, -l'));
  console.log();
  console.log(chalk.gray('  查看 Agents:'));
  console.log(chalk.cyan('    --list-agents, -la'));
  console.log();
  console.log(chalk.gray('  查看 Skills:'));
  console.log(chalk.cyan('    --list-skills, -ls'));
  console.log();
  console.log(chalk.gray('  查看详情:'));
  console.log(chalk.cyan('    --info-agent=<category>/<name>'));
  console.log(chalk.cyan('    --info-skill=<category>/<name>'));
  console.log();
  console.log(chalk.gray('  安装:'));
  console.log(chalk.cyan('    --agent=<category>/<name>'));
  console.log(chalk.cyan('    --skill=<category>/<name>           # 全局安装'));
  console.log(chalk.cyan('    --skill=<category>/<name> --local   # 项目级安装'));
  console.log();
  console.log(chalk.gray('  卸载:'));
  console.log(chalk.cyan('    --uninstall-agent=<category>/<name>'));
  console.log(chalk.cyan('    --uninstall-skill=<category>/<name>'));
  console.log(chalk.cyan('    --uninstall-skill=<category>/<name> --local'));
  console.log();
  console.log(chalk.gray('  其他:'));
  console.log(chalk.cyan('    --version, -v    显示版本'));
  console.log(chalk.cyan('    --help, -h       显示帮助'));
  console.log(chalk.cyan('    --yes, -y        跳过确认'));
  console.log();
}

/**
 * 比较两个版本号
 * @param {string} version1 - 版本号1
 * @param {string} version2 - 版本号2
 * @returns {number} -1: version1 < version2, 0: 相等, 1: version1 > version2
 */
function compareVersions(version1, version2) {
  const parts1 = version1.split('.').map(Number);
  const parts2 = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}

/**
 * 检查兼容性
 * @param {Object} compatibility - 兼容性要求对象
 * @param {string} currentVersion - 当前版本
 * @returns {{compatible: boolean, message?: string}} 兼容性检查结果
 */
export function checkCompatibility(compatibility, currentVersion) {
  if (!compatibility || !compatibility['claude-code']) {
    return { compatible: true };
  }

  const requirement = compatibility['claude-code'];

  // 解析版本要求 (支持 >=, >, =, <, <= 操作符)
  const match = requirement.match(/^(>=|>|=|<=|<)?\s*(.+)$/);
  if (!match) {
    return {
      compatible: false,
      message: `无效的版本要求格式: ${requirement}`
    };
  }

  const operator = match[1] || '>=';
  const requiredVersion = match[2];

  const comparison = compareVersions(currentVersion, requiredVersion);

  let compatible = false;

  switch (operator) {
    case '>=':
      compatible = comparison >= 0;
      break;
    case '>':
      compatible = comparison > 0;
      break;
    case '=':
      compatible = comparison === 0;
      break;
    case '<=':
      compatible = comparison <= 0;
      break;
    case '<':
      compatible = comparison < 0;
      break;
  }

  if (!compatible) {
    return {
      compatible: false,
      message: `需要 Claude Code ${operator} ${requiredVersion}, 当前版本: ${currentVersion}`
    };
  }

  return { compatible: true };
}
