import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  href?: string;
  soon?: boolean;
  disabled?: boolean;
  new?: boolean;
  update?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  premium?: boolean;
  changelog?: boolean;
  popular?: boolean;
  highlight?: NavItemHighlight;
}

export type NavItemHighlight = {
  order?: number;
  examples: string[];
};

export interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export type MainNavItem = NavItem;

export type FooterNavItem = NavItem;

export type SidebarNavItem = NavItemWithChildren;

export interface BlockPrimaryCategory {
  title: string;
  default?: boolean;
  slug: string;
  description?: string;
  published?: boolean;
  keywords?: string[];
  new?: boolean;
  sub?: BlockSecondaryCategory[];
}
export interface BlockSecondaryCategory {
  title: string;
  slug: string;
  new?: boolean;
  default?: boolean;
  published?: boolean;
  description?: string;
  keywords?: string[];
  blocks: BlockItem[];
}

export interface BlockItem {
  slug: string;
  path?: string;
  relativePath?: string;
  published: boolean;
  new?: boolean;
  previewHeight?: number;
  name?: string;
  filename?: string;
  code?: string;
  highlightedCode?: string;
}

export type BlocksConfig = BlockPrimaryCategory[];

export interface ExamplePreviewProps {
  path: string;
}

export interface ExampleCodesProps {
  name: string;
}

export interface ComponentExamples {
  [name: string]: {
    code: string;
    highlightedCode: string;
  };
}

export interface ComponentCode {
  [name: string]: {
    code: string;
    highlightedCode: string;
  };
}

export type PreviewMode = 'layout' | 'block';
