import { homedir } from 'os';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Installation paths
export const AGENT_INSTALL_PATH = join(homedir(), '.claude', 'agents');
export const SKILL_GLOBAL_INSTALL_PATH = join(homedir(), '.claude', 'skills');
export const SKILL_LOCAL_INSTALL_PATH = join(process.cwd(), '.claude', 'skills');

// Source directories
export const AGENTS_DIR = join(__dirname, '..', 'agents');
export const SKILLS_DIR = join(__dirname, '..', 'skills');

// Color theme configuration
export const COLORS = {
  primary: '#7C3AED',    // Purple
  success: '#10B981',    // Green
  warning: '#F59E0B',    // Amber
  error: '#EF4444',      // Red
  info: '#3B82F6',       // Blue
  muted: '#6B7280',      // Gray
};

// Agent category configuration
export const AGENT_CATEGORIES = {
  'specialized': {
    icon: '🔧',
    color: 'yellow',
    title: 'Specialized'
  },
  'development-team': {
    icon: '🎨',
    color: 'cyan',
    title: 'Development Team'
  },
  'productivity': {
    icon: '📝',
    color: 'green',
    title: 'Productivity'
  }
};

// Skill category configuration
export const SKILL_CATEGORIES = {
  'code-generation': {
    icon: '💻',
    color: 'cyan',
    title: 'Code Generation'
  },
  'testing': {
    icon: '🧪',
    color: 'green',
    title: 'Testing'
  },
  'refactoring': {
    icon: '🔨',
    color: 'yellow',
    title: 'Refactoring'
  }
};

// Banner ASCII art
export const BANNER = `
   _____ _                 _        _____           _ _    _ _
  / ____| |               | |      |_   _|__   ___ | | | _(_) |_
 | |    | | __ _ _   _  __| | ___    | |/ _ \\ / _ \\| | |/ / | __|
 | |____| |/ _\` | | | |/ _\` |/ _ \\   | | (_) | (_) | |   <| | |_
  \\_____|_|\\__,_|\\__,_|\\__,_|\\___/   |_|\\___/ \\___/|_|_|\\_\\_|\\__|
`;

// Version info
export const VERSION_SUFFIX = '  Agents & Skills for Claude Code';
