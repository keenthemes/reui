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

export interface BlockCategory {
  title: string;
  slug: string;
  disabled?: boolean;
  description?: string;
  sub?: BlockSubCategory[];
}

export interface BlockSubCategory {
  title: string;
  slug: string;
  disabled?: boolean;
  description?: string;
  blocks?: BlockItem[];
}

export interface BlockItem {
  id: string;
  title: string;
  description?: string;
  published: boolean;
  new?: boolean;
  previewHeight?: number;
}

export type BlocksConfig = BlockCategory[];

export interface PreviewConfig {
  [key: string]: PreviewCategory | PreviewItem;
}

export interface PreviewCategory {
  title: string;
  description?: string;
  children: {
    [key: string]: PreviewCategory | PreviewItem;
  };
}

export interface ExamplePreviewProps {
  path: string;
}

export interface ExampleCodesProps {
  name: string;
}

export interface PreviewItem {
  title: string;
  path?: string;
  description?: string;
  published?: boolean;
  previewHeight?: number;
  new?: boolean;
  hot?: boolean;
  free?: boolean;
  related?: string[];
  file?: PreviewItemFile;
  files?: PreviewFilesTree[];
}

export interface PreviewFilesTree {
  name: string;
  type: 'file' | 'folder';
  path: string;
  meta?: PreviewItemFile; // Meta field for file nodes
  children?: PreviewFilesTree[]; // For folders
}

export interface PreviewItemFile {
  filename?: string;
  filePath?: string;
  type?: string;
  path: string;
  code?: string;
  highlightedCode?: string;
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
