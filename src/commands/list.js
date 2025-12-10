/**
 * 列表展示命令模块
 * 提供 Agent 和 Skill 的列表展示功能
 */

import { join } from 'path';
import chalk from 'chalk';
import {
  getSourcePaths,
  getAgentInstallPath,
  getSkillInstallPath
} from '../utils/paths.js';
import {
  readDirectory,
  isDirectory,
  isInstalled,
  readManifest
} from '../utils/fs.js';
import {
  showListHeader,
  showSection,
  showCategory,
  showCategoryEnd,
  showListItem,
  showListFooter,
  showError,
  showInfo
} from '../utils/display.js';
import { AGENT_CATEGORIES, SKILL_CATEGORIES } from '../constants.js';

/**
 * 获取所有 Agent 列表
 * @returns {Promise<Array>} Agent 列表
 */
async function getAgentsList() {
  const agents = [];
  const { agents: agentsDir } = getSourcePaths();

  try {
    const categories = await readDirectory(agentsDir);

    for (const category of categories) {
      const categoryPath = join(agentsDir, category);
      const isDir = await isDirectory(categoryPath);

      if (!isDir) continue;

      const items = await readDirectory(categoryPath);

      for (const name of items) {
        const itemPath = join(categoryPath, name);
        const isItemDir = await isDirectory(itemPath);

        if (!isItemDir) continue;

        try {
          const manifest = await readManifest(itemPath);

          // 检查全局安装状态
          const installPath = getAgentInstallPath(category, name);
          const installed = await isInstalled(installPath);

          agents.push({
            category,
            name,
            manifest,
            installed,
            installPath: installed ? installPath : null
          });
        } catch (error) {
          // 跳过无效的 agent
          console.error(chalk.gray(`  警告: 跳过无效 agent ${category}/${name}: ${error.message}`));
        }
      }
    }

    return agents;
  } catch (error) {
    throw new Error(`读取 Agents 列表失败: ${error.message}`);
  }
}

/**
 * 获取所有 Skill 列表
 * @returns {Promise<Array>} Skill 列表
 */
async function getSkillsList() {
  const skills = [];
  const { skills: skillsDir } = getSourcePaths();

  try {
    const categories = await readDirectory(skillsDir);

    for (const category of categories) {
      const categoryPath = join(skillsDir, category);
      const isDir = await isDirectory(categoryPath);

      if (!isDir) continue;

      const items = await readDirectory(categoryPath);

      for (const name of items) {
        const itemPath = join(categoryPath, name);
        const isItemDir = await isDirectory(itemPath);

        if (!isItemDir) continue;

        try {
          const manifest = await readManifest(itemPath);

          // 检查全局和本地安装状态
          const globalInstallPath = getSkillInstallPath(category, name, false);
          const localInstallPath = getSkillInstallPath(category, name, true);

          const globalInstalled = await isInstalled(globalInstallPath);
          const localInstalled = await isInstalled(localInstallPath);

          skills.push({
            category,
            name,
            manifest,
            globalInstalled,
            localInstalled,
            globalInstallPath: globalInstalled ? globalInstallPath : null,
            localInstallPath: localInstalled ? localInstallPath : null
          });
        } catch (error) {
          // 跳过无效的 skill
          console.error(chalk.gray(`  警告: 跳过无效 skill ${category}/${name}: ${error.message}`));
        }
      }
    }

    return skills;
  } catch (error) {
    throw new Error(`读取 Skills 列表失败: ${error.message}`);
  }
}

/**
 * 按分类分组数据
 * @param {Array} items - 项目列表
 * @returns {Object} 分组后的对象
 */
function groupByCategory(items) {
  const grouped = {};

  items.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });

  return grouped;
}

/**
 * 列出所有 Agents
 * @returns {Promise<void>}
 */
export async function listAgents() {
  try {
    const agents = await getAgentsList();

    if (agents.length === 0) {
      showInfo('没有找到可用的 Agents');
      return;
    }

    showSection('🤖 AGENTS (角色模板)', '');

    const grouped = groupByCategory(agents);
    const sortedCategories = Object.keys(grouped).sort();

    for (const category of sortedCategories) {
      const categoryInfo = AGENT_CATEGORIES[category] || {
        icon: '📦',
        title: category
      };

      showCategory(categoryInfo.title, categoryInfo.icon);

      const categoryAgents = grouped[category].sort((a, b) => a.name.localeCompare(b.name));

      categoryAgents.forEach(agent => {
        const status = agent.installed ? '●' : '○';
        const description = agent.manifest.description || agent.manifest.description_en || '无描述';

        showListItem(agent.name, description, status);
      });

      showCategoryEnd();
    }

    console.log();
  } catch (error) {
    showError(`列出 Agents 失败: ${error.message}`);
    throw error;
  }
}

/**
 * 列出所有 Skills
 * @returns {Promise<void>}
 */
export async function listSkills() {
  try {
    const skills = await getSkillsList();

    if (skills.length === 0) {
      showInfo('没有找到可用的 Skills');
      return;
    }

    showSection('🛠 SKILLS (技能模板)', '');

    const grouped = groupByCategory(skills);
    const sortedCategories = Object.keys(grouped).sort();

    for (const category of sortedCategories) {
      const categoryInfo = SKILL_CATEGORIES[category] || {
        icon: '📦',
        title: category
      };

      showCategory(categoryInfo.title, categoryInfo.icon);

      const categorySkills = grouped[category].sort((a, b) => a.name.localeCompare(b.name));

      categorySkills.forEach(skill => {
        let status = '○';
        if (skill.globalInstalled) {
          status = '●';
        } else if (skill.localInstalled) {
          status = '[local]';
        }

        const description = skill.manifest.description || skill.manifest.description_en || '无描述';

        showListItem(skill.name, description, status);
      });

      showCategoryEnd();
    }

    console.log();
  } catch (error) {
    showError(`列出 Skills 失败: ${error.message}`);
    throw error;
  }
}

/**
 * 列出所有 Agents 和 Skills
 * @returns {Promise<void>}
 */
export async function listAll() {
  try {
    showListHeader('📦 Claude Toolkit - 可用模板');

    // 列出 Agents
    await listAgents();

    console.log();

    // 列出 Skills
    await listSkills();

    // 显示底部说明
    showListFooter();
  } catch (error) {
    showError(`列出模板失败: ${error.message}`);
    process.exit(1);
  }
}

/**
 * 获取特定 Agent 信息
 * @param {string} category - 分类
 * @param {string} name - 名称
 * @returns {Promise<Object|null>} Agent 信息
 */
export async function getAgentInfo(category, name) {
  try {
    const agents = await getAgentsList();
    return agents.find(agent => agent.category === category && agent.name === name) || null;
  } catch (error) {
    throw new Error(`获取 Agent 信息失败: ${error.message}`);
  }
}

/**
 * 获取特定 Skill 信息
 * @param {string} category - 分类
 * @param {string} name - 名称
 * @returns {Promise<Object|null>} Skill 信息
 */
export async function getSkillInfo(category, name) {
  try {
    const skills = await getSkillsList();
    return skills.find(skill => skill.category === category && skill.name === name) || null;
  } catch (error) {
    throw new Error(`获取 Skill 信息失败: ${error.message}`);
  }
}

/**
 * 统计模板数量
 * @returns {Promise<{agents: number, skills: number, total: number}>}
 */
export async function getTemplateCounts() {
  try {
    const agents = await getAgentsList();
    const skills = await getSkillsList();

    return {
      agents: agents.length,
      skills: skills.length,
      total: agents.length + skills.length
    };
  } catch (error) {
    return {
      agents: 0,
      skills: 0,
      total: 0
    };
  }
}
