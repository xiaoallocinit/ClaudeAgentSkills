/**
 * 文件系统工具模块
 * 提供文件和目录操作功能
 */

import fs from 'fs-extra';
import { join } from 'path';

/**
 * 确保目录存在,如果不存在则创建
 * @param {string} dir - 目录路径
 * @returns {Promise<void>}
 */
export async function ensureDir(dir) {
  try {
    await fs.ensureDir(dir);
  } catch (error) {
    throw new Error(`创建目录失败: ${dir}\n原因: ${error.message}`);
  }
}

/**
 * 递归复制目录
 * @param {string} src - 源路径
 * @param {string} dest - 目标路径
 * @param {Object} options - 复制选项
 * @param {boolean} options.overwrite - 是否覆盖已存在的文件
 * @returns {Promise<void>}
 */
export async function copyDirectory(src, dest, options = { overwrite: true }) {
  try {
    await fs.copy(src, dest, options);
  } catch (error) {
    throw new Error(`复制目录失败: ${src} -> ${dest}\n原因: ${error.message}`);
  }
}

/**
 * 删除目录及其所有内容
 * @param {string} dir - 目录路径
 * @returns {Promise<void>}
 */
export async function removeDirectory(dir) {
  try {
    await fs.remove(dir);
  } catch (error) {
    throw new Error(`删除目录失败: ${dir}\n原因: ${error.message}`);
  }
}

/**
 * 读取并解析 manifest.json 文件
 * @param {string} dir - 包含 manifest.json 的目录路径
 * @returns {Promise<Object>} manifest 对象
 */
export async function readManifest(dir) {
  const manifestPath = join(dir, 'manifest.json');

  try {
    // 检查文件是否存在
    const exists = await fs.pathExists(manifestPath);
    if (!exists) {
      throw new Error(`manifest.json 文件不存在`);
    }

    // 读取并解析 JSON
    const manifest = await fs.readJson(manifestPath);

    // 验证必需字段
    const requiredFields = ['type', 'name', 'description', 'version', 'category'];
    const missingFields = requiredFields.filter(field => !manifest[field]);

    if (missingFields.length > 0) {
      throw new Error(`manifest.json 缺少必需字段: ${missingFields.join(', ')}`);
    }

    // 验证类型字段
    if (!['agent', 'skill'].includes(manifest.type)) {
      throw new Error(`manifest.json 中的 type 字段无效: ${manifest.type}`);
    }

    return manifest;
  } catch (error) {
    if (error.message.includes('manifest.json')) {
      throw error;
    }
    throw new Error(`读取 manifest.json 失败: ${manifestPath}\n原因: ${error.message}`);
  }
}

/**
 * 检查指定路径是否已安装
 * @param {string} installPath - 安装路径
 * @returns {Promise<boolean>} 是否已安装
 */
export async function isInstalled(installPath) {
  try {
    const exists = await fs.pathExists(installPath);
    if (!exists) {
      return false;
    }

    // 检查是否包含必要文件
    const manifestExists = await fs.pathExists(join(installPath, 'manifest.json'));
    return manifestExists;
  } catch (error) {
    return false;
  }
}

/**
 * 检查源路径是否存在且有效
 * @param {string} sourcePath - 源路径
 * @param {string} type - 类型 ('agent' 或 'skill')
 * @returns {Promise<{exists: boolean, valid: boolean, message?: string}>} 检查结果
 */
export async function validateSource(sourcePath, type) {
  try {
    // 检查目录是否存在
    const exists = await fs.pathExists(sourcePath);
    if (!exists) {
      return {
        exists: false,
        valid: false,
        message: `${type === 'agent' ? 'Agent' : 'Skill'} 不存在`
      };
    }

    // 检查 manifest.json
    const manifestPath = join(sourcePath, 'manifest.json');
    const manifestExists = await fs.pathExists(manifestPath);
    if (!manifestExists) {
      return {
        exists: true,
        valid: false,
        message: '缺少 manifest.json 文件'
      };
    }

    // 检查主文件
    const mainFile = type === 'agent' ? 'CLAUDE.md' : 'SKILL.md';
    const mainFilePath = join(sourcePath, mainFile);
    const mainFileExists = await fs.pathExists(mainFilePath);
    if (!mainFileExists) {
      return {
        exists: true,
        valid: false,
        message: `缺少 ${mainFile} 文件`
      };
    }

    return {
      exists: true,
      valid: true
    };
  } catch (error) {
    return {
      exists: false,
      valid: false,
      message: error.message
    };
  }
}

/**
 * 复制文件
 * @param {string} src - 源文件路径
 * @param {string} dest - 目标文件路径
 * @returns {Promise<void>}
 */
export async function copyFile(src, dest) {
  try {
    await fs.copy(src, dest);
  } catch (error) {
    throw new Error(`复制文件失败: ${src} -> ${dest}\n原因: ${error.message}`);
  }
}

/**
 * 读取目录内容
 * @param {string} dir - 目录路径
 * @returns {Promise<string[]>} 文件和子目录名称数组
 */
export async function readDirectory(dir) {
  try {
    const exists = await fs.pathExists(dir);
    if (!exists) {
      return [];
    }
    return await fs.readdir(dir);
  } catch (error) {
    throw new Error(`读取目录失败: ${dir}\n原因: ${error.message}`);
  }
}

/**
 * 检查路径是否为目录
 * @param {string} path - 路径
 * @returns {Promise<boolean>} 是否为目录
 */
export async function isDirectory(path) {
  try {
    const stats = await fs.stat(path);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * 获取目录大小(字节)
 * @param {string} dir - 目录路径
 * @returns {Promise<number>} 目录大小
 */
export async function getDirectorySize(dir) {
  let size = 0;

  try {
    const exists = await fs.pathExists(dir);
    if (!exists) {
      return 0;
    }

    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = join(dir, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        size += await getDirectorySize(filePath);
      } else {
        size += stats.size;
      }
    }

    return size;
  } catch (error) {
    return 0;
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小
 */
export function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
