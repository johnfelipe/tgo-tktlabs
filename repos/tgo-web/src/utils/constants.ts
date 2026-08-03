
import type { NavigationItem } from '@/types';

// Navigation items configuration
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'chat',
    title: 'navigation.chat',
    icon: 'MessageCircle',
    path: '/chat'
  },
  {
    id: 'ai',
    title: 'navigation.ai',
    icon: 'Sparkles',
    path: '/ai'
  },
  {
    id: 'visitors',
    title: 'navigation.visitors',
    icon: 'Users',
    path: '/visitors'
  },
  {
    id: 'knowledge',
    title: 'navigation.knowledge',
    icon: 'Library',
    path: '/knowledge'
  },
  {
    id: 'channels',
    title: 'navigation.channels',
    icon: 'Platform',
    path: '/platforms'
  },
  {
    id: 'settings',
    title: 'navigation.settings',
    icon: 'Settings',
    path: '/settings'
  }
];

// AI功能菜单配置
export const AI_MENU_ITEMS: NavigationItem[] = [
  {
    id: 'agents',
    title: 'navigation.agents',
    icon: 'Bot',
    path: '/ai/agents'
  },
  {
    id: 'tools',
    title: 'navigation.tools',
    icon: 'Wrench',
    path: '/ai/tools'
  },
  {
    id: 'skills',
    title: 'navigation.skills',
    icon: 'Zap',
    path: '/ai/skills'
  },
  {
    id: 'device-control',
    title: 'navigation.deviceControl',
    icon: 'Monitor',
    path: '/ai/device-control'
  },
  {
    id: 'workflows',
    title: 'navigation.workflows',
    icon: 'GitBranch',
    path: '/ai/workflows'
  }
];

// Platform icons mapping
export const PLATFORM_ICONS: Record<string, string> = {
  wechat: 'https://cdn.simpleicons.org/wechat/07C160',
  tiktok: 'https://cdn.simpleicons.org/tiktok/000000',
  website: 'Globe'
} as const;

// Message types
export const MESSAGE_TYPES = {
  VISITOR: 'visitor',
  AGENT: 'agent',
  SYSTEM: 'system'
} as const;

// Tag colors mapping
export const TAG_COLORS: Record<string, string> = {
  'Nuevo usuario': 'bg-blue-100 text-blue-700',
  'Desde búsqueda': 'bg-gray-100 text-gray-700',
  'Desde sitio oficial': 'bg-gray-100 text-gray-700',
  'Consultar producto A': 'bg-green-100 text-green-700',
  'Cliente antiguo': 'bg-purple-100 text-purple-700',
  'Soporte técnico': 'bg-indigo-100 text-indigo-700',
  'Pendiente de seguimiento': 'bg-yellow-100 text-yellow-700',
  'Queja': 'bg-red-100 text-red-700',
  'Alta prioridad': 'bg-pink-100 text-pink-700',
  'Consultar preventa': 'bg-gray-100 text-gray-700'
} as const;

// Avatar placeholder URLs
export const AVATAR_URLS: Record<string, string> = {
  user: 'https://i.pravatar.cc/40?img=0',
  visitor: 'https://i.pravatar.cc/64?img=30'
} as const;
