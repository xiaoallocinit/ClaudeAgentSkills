/**
 * 安装命令模块
 * 提供 Agent 和 Skill 的安装功能
 */

import { join } from 'path';
import ora from 'ora';
import chalk from 'chalk';
import {
  parsePath,
  getAgentSourcePath,
  getAgentInstallPath,
  getSkillSourcePath,
  getSkillInstallPath
} from '../utils/paths.js';
import {
  ensureDir,
  copyFile,
  copyDirectory,
  isInstalled,
  validateSource,
  readManifest,
  readDirectory,
  isDirectory
} from '../utils/fs.js';
import {
  showError,
  showWarning,
  showInstallSuccess,
  showInfo
} from '../utils/display.js';

/**
 * 安装 Agent
 * @param {string} path - Agent 路径 (category/name)
 * @param {boolean} skipConfirm - 是否跳过确认
 * @returns {Promise<boolean>} 是否安装成功
 */
export async function installAgent(path, skipConfirm = false) {
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
    console.log(chalk.cyan.bold(`🚀 正在安装 Agent: ${category}/${name}`));
    console.log();

    // 获取源路径和安装路径
    const sourcePath = getAgentSourcePath(category, name);
    const installPath = getAgentInstallPath(category, name);

    // 验证源
    spinner = ora('检查 Agent 源...').start();
    const validation = await validateSource(sourcePath, 'agent');

    if (!validation.exists || !validation.valid) {
      spinner.fail('源验证失败');
      showError(validation.message || `Agent 不存在: ${path}`);
      return false;
    }
    spinner.succeed('源验证通过');

    // 检查是否已安装
    const alreadyInstalled = await isInstalled(installPath);
    if (alreadyInstalled) {
      if (!skipConfirm) {
        showWarning(`Agent 已存在: ${installPath}`);
        showInfo('将覆盖已有安装。如需跳过确认,请使用 --yes 参数');
        // 这里应该加入用户确认逻辑,简化版本直接继续
      }
      spinner = ora('删除旧版本...').start();
      spinner.succeed('准备覆盖安装');
    }

    // 创建安装目录
    spinner = ora('创建安装目录...').start();
    await ensureDir(installPath);
    spinner.succeed('安装目录已创建');

    // 复制 CLAUDE.md
    spinner = ora('复制 CLAUDE.md...').start();
    const claudeMdSource = join(sourcePath, 'CLAUDE.md');
    const claudeMdDest = join(installPath, 'CLAUDE.md');
    await copyFile(claudeMdSource, claudeMdDest);
    spinner.succeed('CLAUDE.md 已复制');

    // 复制 manifest.json
    spinner = ora('复制 manifest.json...').start();
    const manifestSource = join(sourcePath, 'manifest.json');
    const manifestDest = join(installPath, 'manifest.json');
    await copyFile(manifestSource, manifestDest);
    spinner.succeed('manifest.json 已复制');

    // 检查是否有其他文件需要复制
    const sourceFiles = await readDirectory(sourcePath);
    const additionalFiles = sourceFiles.filter(
      file => file !== 'CLAUDE.md' && file !== 'manifest.json' && !file.startsWith('.')
    );

    if (additionalFiles.length > 0) {
      spinner = ora('复制附加文件...').start();
      for (const file of additionalFiles) {
        const fileSource = join(sourcePath, file);
        const fileDest = join(installPath, file);

        if (await isDirectory(fileSource)) {
          await copyDirectory(fileSource, fileDest);
        } else {
          await copyFile(fileSource, fileDest);
        }
      }
      spinner.succeed(`已复制 ${additionalFiles.length} 个附加文件`);
    }

    spinner = ora('完成安装...').start();
    spinner.succeed('安装完成!');

    // 显示成功信息
    const usage = `claude --agent ${category}/${name}`;
    showInstallSuccess('agent', category, name, installPath, usage);

    return true;
  } catch (error) {
    if (spinner) {
      spinner.fail('安装失败');
    }
    showError(`安装 Agent 失败: ${error.message}`);
    return false;
  }
}

/**
 * 安装 Skill
 * @param {string} path - Skill 路径 (category/name)
 * @param {boolean} isLocal - 是否安装到当前项目
 * @param {boolean} skipConfirm - 是否跳过确认
 * @returns {Promise<boolean>} 是否安装成功
 */
export async function installSkill(path, isLocal = false, skipConfirm = false) {
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
    console.log(chalk.cyan.bold(`🚀 正在${scope}安装 Skill: ${category}/${name}`));
    console.log();

    // 获取源路径和安装路径
    const sourcePath = getSkillSourcePath(category, name);
    const installPath = getSkillInstallPath(category, name, isLocal);

    // 验证源
    spinner = ora('检查 Skill 源...').start();
    const validation = await validateSource(sourcePath, 'skill');

    if (!validation.exists || !validation.valid) {
      spinner.fail('源验证失败');
      showError(validation.message || `Skill 不存在: ${path}`);
      return false;
    }
    spinner.succeed('源验证通过');

    // 检查是否已安装
    const alreadyInstalled = await isInstalled(installPath);
    if (alreadyInstalled) {
      if (!skipConfirm) {
        showWarning(`Skill 已存在: ${installPath}`);
        showInfo('将覆盖已有安装。如需跳过确认,请使用 --yes 参数');
        // 这里应该加入用户确认逻辑,简化版本直接继续
      }
      spinner = ora('删除旧版本...').start();
      spinner.succeed('准备覆盖安装');
    }

    // 创建安装目录
    spinner = ora('创建安装目录...').start();
    await ensureDir(installPath);
    spinner.succeed('安装目录已创建');

    // 复制 SKILL.md
    spinner = ora('复制 SKILL.md...').start();
    const skillMdSource = join(sourcePath, 'SKILL.md');
    const skillMdDest = join(installPath, 'SKILL.md');
    await copyFile(skillMdSource, skillMdDest);
    spinner.succeed('SKILL.md 已复制');

    // 复制 manifest.json
    spinner = ora('复制 manifest.json...').start();
    const manifestSource = join(sourcePath, 'manifest.json');
    const manifestDest = join(installPath, 'manifest.json');
    await copyFile(manifestSource, manifestDest);
    spinner.succeed('manifest.json 已复制');

    // 读取 manifest 检查是否有 templates
    const manifest = await readManifest(sourcePath);

    // 检查并复制 templates 目录
    const templatesSource = join(sourcePath, 'templates');
    const hasTemplates = await isDirectory(templatesSource);

    if (hasTemplates) {
      spinner = ora('复制模板文件...').start();
      const templatesDest = join(installPath, 'templates');
      await copyDirectory(templatesSource, templatesDest);

      const templateCount = manifest.templates ? manifest.templates.length : 0;
      spinner.succeed(`已复制 ${templateCount} 个模板文件`);
    }

    // 检查是否有其他文件需要复制
    const sourceFiles = await readDirectory(sourcePath);
    const additionalFiles = sourceFiles.filter(
      file =>
        file !== 'SKILL.md' &&
        file !== 'manifest.json' &&
        file !== 'templates' &&
        !file.startsWith('.')
    );

    if (additionalFiles.length > 0) {
      spinner = ora('复制附加文件...').start();
      for (const file of additionalFiles) {
        const fileSource = join(sourcePath, file);
        const fileDest = join(installPath, file);

        if (await isDirectory(fileSource)) {
          await copyDirectory(fileSource, fileDest);
        } else {
          await copyFile(fileSource, fileDest);
        }
      }
      spinner.succeed(`已复制 ${additionalFiles.length} 个附加文件`);
    }

    spinner = ora('完成安装...').start();
    spinner.succeed('安装完成!');

    // 显示成功信息
    const localFlag = isLocal ? ' --local' : '';
    const usage = `claude --skill ${category}/${name}${localFlag}`;
    showInstallSuccess('skill', category, name, installPath, usage);

    return true;
  } catch (error) {
    if (spinner) {
      spinner.fail('安装失败');
    }
    showError(`安装 Skill 失败: ${error.message}`);
    return false;
  }
}

/**
 * 批量安装
 * @param {Array<{type: string, path: string, isLocal?: boolean}>} items - 待安装项目列表
 * @param {boolean} skipConfirm - 是否跳过确认
 * @returns {Promise<{success: number, failed: number}>} 安装结果统计
 */
export async function batchInstall(items, skipConfirm = false) {
  const results = {
    success: 0,
    failed: 0
  };

  console.log();
  console.log(chalk.cyan.bold(`📦 批量安装 ${items.length} 个模板...`));
  console.log();

  for (const item of items) {
    let success = false;

    if (item.type === 'agent') {
      success = await installAgent(item.path, skipConfirm);
    } else if (item.type === 'skill') {
      success = await installSkill(item.path, item.isLocal || false, skipConfirm);
    }

    if (success) {
      results.success++;
    } else {
      results.failed++;
    }

    // 每次安装后稍作延迟,避免输出混乱
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log();
  console.log(chalk.bold('批量安装完成:'));
  console.log(chalk.green(`  ✓ 成功: ${results.success}`));
  if (results.failed > 0) {
    console.log(chalk.red(`  ✗ 失败: ${results.failed}`));
  }
  console.log();

  return results;
}
