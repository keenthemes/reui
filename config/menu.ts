import {
  AlertTriangle,
  BarChart3,
  Database,
  FileText,
  Globe,
  Key,
  LucideIcon,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

export interface MenuItem {
  title: string;
  path?: string;
  icon?: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  new?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface MenuConfig {
  sidebar: MenuSection[];
  header?: MenuItem[];
}

export const menuConfig: MenuConfig = {
  sidebar: [
    {
      title: 'Configuration',
      items: [
        {
          title: 'API Setup',
          path: '/configuration/api-setup',
          icon: Settings,
        },
        {
          title: 'Team Settings',
          path: '/configuration/team-settings',
          icon: Users,
          active: true,
        },
        {
          title: 'Authentication',
          path: '/configuration/authentication',
          icon: Key,
        },
        {
          title: 'Endpoints Configs',
          path: '/configuration/endpoints-configs',
          icon: Globe,
        },
        {
          title: 'Rate Limiting',
          path: '/configuration/rate-limiting',
          icon: Zap,
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          title: 'Data Encryption',
          path: '/security/data-encryption',
          icon: Shield,
        },
        {
          title: 'Rate Limiting',
          path: '/security/rate-limiting',
          icon: Zap,
        },
        {
          title: 'Access Control',
          path: '/security/access-control',
          icon: Key,
        },
        {
          title: 'Incident Response',
          path: '/security/incident-response',
          icon: AlertTriangle,
        },
      ],
    },
    {
      title: 'Analytics',
      items: [
        {
          title: 'Fetching Data',
          path: '/analytics/fetching-data',
          icon: Database,
        },
        {
          title: 'Custom Reports',
          path: '/analytics/custom-reports',
          icon: FileText,
        },
        {
          title: 'Real Time Analytics',
          path: '/analytics/real-time-analytics',
          icon: TrendingUp,
        },
      ],
    },
  ],
  header: [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: BarChart3,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ],
};
