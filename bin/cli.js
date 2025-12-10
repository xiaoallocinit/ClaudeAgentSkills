#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import commands
import { listAll, listAgents, listSkills } from '../src/commands/list.js';
import { showAgentInfo, showSkillInfo } from '../src/commands/info.js';
import { installAgent, installSkill } from '../src/commands/install.js';
import { uninstallAgent, uninstallSkill } from '../src/commands/uninstall.js';

// Import utils
import { isValidPath, parsePath } from '../src/utils/paths.js';
import { BANNER, VERSION_SUFFIX } from '../src/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
);

const program = new Command();

// Display banner
console.log(chalk.cyan(BANNER));
console.log(chalk.gray(`                                                        v${packageJson.version}`));
console.log(chalk.gray(VERSION_SUFFIX));
console.log('');

program
  .name('claude-toolkit')
  .description('A collection of Claude Code Agents and Skills templates')
  .version(packageJson.version, '-v, --version', 'Output the current version');

// Main options
program
  .option('--agent <path>', 'Install specified agent (format: category/name)')
  .option('--skill <path>', 'Install specified skill (format: category/name)')
  .option('--local', 'Install skill to current project (only works with --skill)')
  .option('-l, --list', 'List all available agents and skills')
  .option('-la, --list-agents', 'List all available agents')
  .option('-ls, --list-skills', 'List all available skills')
  .option('--info-agent <path>', 'Show detailed information about an agent')
  .option('--info-skill <path>', 'Show detailed information about a skill')
  .option('--uninstall-agent <path>', 'Uninstall an agent')
  .option('--uninstall-skill <path>', 'Uninstall a skill')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-h, --help', 'Display help information');

program.parse(process.argv);

const options = program.opts();

// Handle commands
(async () => {
  try {
    // Display help
    if (options.help) {
      showHelp();
      process.exit(0);
    }

    // List all templates
    if (options.list) {
      await listAll();
      process.exit(0);
    }

    // List agents only
    if (options.listAgents) {
      await listAgents();
      process.exit(0);
    }

    // List skills only
    if (options.listSkills) {
      await listSkills();
      process.exit(0);
    }

    // Show agent info
    if (options.infoAgent) {
      const path = options.infoAgent;
      if (!isValidPath(path)) {
        console.log(chalk.red('❌ Invalid path format!'));
        console.log(chalk.yellow('Expected format: category/name'));
        console.log(chalk.dim('Example: specialized/vue3-expert'));
        process.exit(1);
      }

      const { category, name } = parsePath(path);
      await showAgentInfo(category, name);
      process.exit(0);
    }

    // Show skill info
    if (options.infoSkill) {
      const path = options.infoSkill;
      if (!isValidPath(path)) {
        console.log(chalk.red('❌ Invalid path format!'));
        console.log(chalk.yellow('Expected format: category/name'));
        console.log(chalk.dim('Example: code-generation/vue3-component'));
        process.exit(1);
      }

      const { category, name } = parsePath(path);
      await showSkillInfo(category, name);
      process.exit(0);
    }

    // Uninstall agent
    if (options.uninstallAgent) {
      const path = options.uninstallAgent;
      if (!isValidPath(path)) {
        console.log(chalk.red('❌ Invalid path format!'));
        console.log(chalk.yellow('Expected format: category/name'));
        process.exit(1);
      }

      const { category, name } = parsePath(path);
      const success = await uninstallAgent(category, name, options.yes);
      process.exit(success ? 0 : 1);
    }

    // Uninstall skill
    if (options.uninstallSkill) {
      const path = options.uninstallSkill;
      if (!isValidPath(path)) {
        console.log(chalk.red('❌ Invalid path format!'));
        console.log(chalk.yellow('Expected format: category/name'));
        process.exit(1);
      }

      const { category, name } = parsePath(path);
      const success = await uninstallSkill(category, name, options.local, options.yes);
      process.exit(success ? 0 : 1);
    }

    // Install agent
    if (options.agent) {
      const path = options.agent;
      if (!isValidPath(path)) {
        console.log(chalk.red('❌ Invalid path format!'));
        console.log(chalk.yellow('Expected format: category/name'));
        console.log(chalk.dim('Example: specialized/vue3-expert'));
        process.exit(1);
      }

      const { category, name } = parsePath(path);
      const success = await installAgent(category, name, options.yes);
      process.exit(success ? 0 : 1);
    }

    // Install skill
    if (options.skill) {
      const path = options.skill;
      if (!isValidPath(path)) {
        console.log(chalk.red('❌ Invalid path format!'));
        console.log(chalk.yellow('Expected format: category/name'));
        console.log(chalk.dim('Example: code-generation/vue3-component'));
        process.exit(1);
      }

      const { category, name } = parsePath(path);
      const success = await installSkill(category, name, options.local, options.yes);
      process.exit(success ? 0 : 1);
    }

    // No command specified, show help
    if (Object.keys(options).length === 0) {
      showHelp();
    }

  } catch (error) {
    console.error(chalk.red('\n❌ An error occurred:'), error.message);
    if (process.env.DEBUG) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
})();

/**
 * Display help information
 */
function showHelp() {
  console.log(chalk.bold('Welcome to Claude Toolkit! 👋\n'));
  console.log(chalk.white('Available commands:\n'));

  console.log(chalk.cyan('  Agent Commands:'));
  console.log(chalk.gray('  --agent <path>              ') + 'Install an agent');
  console.log(chalk.gray('  --list-agents, -la          ') + 'List all agents');
  console.log(chalk.gray('  --info-agent <path>         ') + 'Show agent information');
  console.log(chalk.gray('  --uninstall-agent <path>    ') + 'Uninstall an agent');
  console.log('');

  console.log(chalk.magenta('  Skill Commands:'));
  console.log(chalk.gray('  --skill <path>              ') + 'Install a skill globally');
  console.log(chalk.gray('  --skill <path> --local      ') + 'Install a skill to current project');
  console.log(chalk.gray('  --list-skills, -ls          ') + 'List all skills');
  console.log(chalk.gray('  --info-skill <path>         ') + 'Show skill information');
  console.log(chalk.gray('  --uninstall-skill <path>    ') + 'Uninstall a skill (global)');
  console.log(chalk.gray('  --uninstall-skill <path> --local') + ' Uninstall a skill (project)');
  console.log('');

  console.log(chalk.green('  General Commands:'));
  console.log(chalk.gray('  --list, -l                  ') + 'List all agents and skills');
  console.log(chalk.gray('  --yes, -y                   ') + 'Skip confirmation prompts');
  console.log(chalk.gray('  --version, -v               ') + 'Show version');
  console.log(chalk.gray('  --help, -h                  ') + 'Show this help message');
  console.log('');

  console.log(chalk.dim('Examples:'));
  console.log(chalk.gray('  # List all templates'));
  console.log(chalk.yellow('  npx github:xiaoallocinit/ClaudeAgentSkills --list'));
  console.log('');
  console.log(chalk.gray('  # Install an agent'));
  console.log(chalk.yellow('  npx github:xiaoallocinit/ClaudeAgentSkills --agent=specialized/vue3-expert'));
  console.log('');
  console.log(chalk.gray('  # Install a skill globally'));
  console.log(chalk.yellow('  npx github:xiaoallocinit/ClaudeAgentSkills --skill=code-generation/vue3-component'));
  console.log('');
  console.log(chalk.gray('  # Install a skill to current project'));
  console.log(chalk.yellow('  npx github:xiaoallocinit/ClaudeAgentSkills --skill=code-generation/vue3-component --local'));
  console.log('');
}
