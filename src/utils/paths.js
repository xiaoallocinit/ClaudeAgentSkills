/**
 * 路径工具模块
 * 提供 Agent 和 Skill 的路径管理功能
 */

import { join } from 'path';
import {
  AGENT_INSTALL_PATH,
  SKILL_GLOBAL_INSTALL_PATH,
  SKILL_LOCAL_INSTALL_PATH,
  AGENTS_DIR,
  SKILLS_DIR
} from '../constants.js';

/**
 * 获取 Agent 源路径
 * @param {string} category - 分类名称
 * @param {string} name - Agent 名称
 * @returns {string} Agent 源路径
 */
export function getAgentSourcePath(category, name) {
  return join(AGENTS_DIR, category, name);
}

/**
 * 获取 Agent 安装路径
 * @param {string} category - 分类名称
 * @param {string} name - Agent 名称
 * @returns {string} Agent 安装路径
 */
export function getAgentInstallPath(category, name) {
  return join(AGENT_INSTALL_PATH, category, name);
}

/**
 * 获取 Skill 源路径
 * @param {string} category - 分类名称
 * @param {string} name - Skill 名称
 * @returns {string} Skill 源路径
 */
export function getSkillSourcePath(category, name) {
  return join(SKILLS_DIR, category, name);
}

/**
 * 获取 Skill 安装路径
 * @param {string} category - 分类名称
 * @param {string} name - Skill 名称
 * @param {boolean} isLocal - 是否为本地安装
 * @returns {string} Skill 安装路径
 */
export function getSkillInstallPath(category, name, isLocal = false) {
  const basePath = isLocal ? SKILL_LOCAL_INSTALL_PATH : SKILL_GLOBAL_INSTALL_PATH;
  return join(basePath, category, name);
}

/**
 * 验证路径格式是否为 category/name
 * @param {string} path - 待验证的路径
 * @returns {boolean} 是否为有效格式
 */
export function isValidPath(path) {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // 检查格式是否为 category/name
  const parts = path.split('/').filter(Boolean);

  // 必须恰好包含两个部分
  if (parts.length !== 2) {
    return false;
  }

  // 检查每个部分是否只包含字母、数字、连字符和下划线
  const validPattern = /^[a-z0-9-_]+$/i;
  return parts.every(part => validPattern.test(part));
}

/**
 * 解析路径为 category 和 name
 * @param {string} path - 格式为 category/name 的路径
 * @returns {{category: string, name: string} | null} 解析结果
 */
export function parsePath(path) {
  if (!isValidPath(path)) {
    return null;
  }

  const [category, name] = path.split('/').filter(Boolean);
  return { category, name };
}

/**
 * 获取所有 Agent 的基础安装路径
 * @returns {string} Agent 基础安装路径
 */
export function getAgentBasePath() {
  return AGENT_INSTALL_PATH;
}

/**
 * 获取 Skill 的基础安装路径
 * @param {boolean} isLocal - 是否为本地安装
 * @returns {string} Skill 基础安装路径
 */
export function getSkillBasePath(isLocal = false) {
  return isLocal ? SKILL_LOCAL_INSTALL_PATH : SKILL_GLOBAL_INSTALL_PATH;
}

/**
 * 获取所有源目录路径
 * @returns {{agents: string, skills: string}} 源目录路径
 */
export function getSourcePaths() {
  return {
    agents: AGENTS_DIR,
    skills: SKILLS_DIR
  };
}
