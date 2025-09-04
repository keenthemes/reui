import { FooterNavItem, MainNavItem, SidebarNavItem } from './types';

export interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
  footerNav: FooterNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: 'Components',
      href: '/',
    },

    {
      title: 'UI Blocks',
      href: '/blocks',
    },
    /*
    {
      title: 'Themes',
      href: '/themes',
    },
    */
    {
      title: 'Docs',
      href: '/docs',
    },
    {
      title: 'Changelog',
      href: '/docs/changelog',
    },
    {
      title: 'Built with ReUI',
      href: '/built-with-reui',
    },
  ],
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
          items: [],
        },
        {
          title: 'Installation',
          href: '/docs/installation',
          items: [],
        },
        /*
        {
          title: 'MCP',
          href: '/docs/mcp',
          
          items: [],
        },
        */
        {
          title: 'Theming',
          href: '/docs/theming',
          items: [],
        },
        {
          title: 'Dark mode',
          href: '/docs/dark-mode',
          items: [],
        },
        {
          title: 'RTL',
          href: '/docs/rtl',
          items: [],
        },
        {
          title: 'References',
          href: '/docs/references',
          items: [],
        },
        {
          title: 'Changelog',
          changelog: true,
          href: '/docs/changelog',
          items: [],
        },
      ],
    },

    {
      title: 'UI Components',
      items: [
        {
          title: 'Accordion',
          href: '/docs/accordion',
          highlight: {
            order: 9,
            examples: ['Default', 'Outline', 'Solid', 'Indicator', 'Nested'],
          },
        },
        {
          title: 'Accordion Menu',
          href: '/docs/accordion-menu',
          highlight: {
            order: 4,
            examples: ['Default', 'States', 'Sub-Menu', 'Multi Expand', 'Multi Level', 'Router'],
          },
        },
        {
          title: 'Alert',
          href: '/docs/alert',

          highlight: {
            order: 8,
            examples: [
              'Solid',
              'Mono',
              'Outline',
              'Stroke',
              'Soft',
              'Size Large',
              'Size Small',
              'Size Xsmall',
              'Extended',
              'Actions',
            ],
          },
        },
        {
          title: 'Alert Dialog',
          href: '/docs/alert-dialog',
          highlight: {
            order: 10,
            examples: ['Default', 'Destructive'],
          },
        },
        {
          title: 'Avatar',
          href: '/docs/avatar',
          highlight: {
            examples: ['Default', 'Fallback', 'Indicator', 'Status', 'Badge', 'Size', 'Group', 'Users'],
          },
        },
        {
          title: 'Badge',
          href: '/docs/badge',

          highlight: {
            order: 5,
            examples: [
              'Default',
              'Stroke',
              'Variants',
              'Outline',
              'Light',
              'Circle',
              'With Dot',
              'With Icon',
              'Remove Button',
              'Square',
              'Size',
              'asChild',
              'Disabled',
            ],
          },
        },
        {
          title: 'Breadcrumb',
          href: '/docs/breadcrumb',
          highlight: {
            order: 6,
            examples: ['Default', 'Icon', 'Separator', 'Dropdown', 'Card'],
          },
        },
        {
          title: 'Button',
          href: '/docs/button',
          highlight: {
            order: 3,
            examples: [
              'Primary',
              'Secondary',
              'Mono',
              'Destructive',
              'Outline',
              'Dashed',
              'Ghost',
              'With Icon',
              'Input Mode',
              'Icon Only',
              'Loading',
              'Badge',
              'Size',
              'Circle',
              'Link',
              'Full Width',
              'Disabled',
            ],
          },
        },
        {
          title: 'Calendar',
          href: '/docs/calendar',
          highlight: {
            examples: ['Default', 'Multiple Months'],
          },
        },
        {
          title: 'Card',
          href: '/docs/card',
          highlight: {
            order: 7,
            examples: ['Default', 'Accent'],
          },
        },
        {
          title: 'Carousel',
          href: '/docs/carousel',
        },
        {
          title: 'Chart',
          href: '/docs/chart',
        },
        {
          title: 'Checkbox',
          href: '/docs/checkbox',
          highlight: {
            order: 16,
            examples: ['Default', 'Checked', 'Disabled', 'Indeterminate', 'Mono', 'Form'],
          },
        },
        {
          title: 'Collapsible',
          href: '/docs/collapsible',
          highlight: {
            order: 13,
            examples: ['Default', 'Card'],
          },
        },
        {
          title: 'Command',
          href: '/docs/command',
        },
        {
          title: 'Combobox',
          href: '/docs/combobox',
          highlight: {
            order: 2,
            examples: [
              'Default',
              'Group',
              'Disabled Option',
              'Indicator Position',
              'Custom Indicator',
              'Add Option',
              'Icon',
              'Status',
              'Country',
              'Timezone',
              'Badge',
              'User',
              'Multiple Default',
              'Multiple Expandable',
              'Multiple Count Label',
              'Form',
            ],
          },
        },
        {
          title: 'Context Menu',
          href: '/docs/context-menu',
        },
        {
          title: 'Code',
          href: '/docs/code',
        },
        {
          title: 'Data Grid',
          href: '/docs/data-grid',
          update: true,
          highlight: {
            order: 1,
            examples: [
              'Default',
              'Cell Border',
              'Dense Table',
              'Light',
              'Striped',
              'Auto Width',
              'Row Selection',
              'Expandable Row',
              'Column Icons',
              'Sortable Columns',
              'Movable Columns',
              'Draggable Columns',
              'Draggable Rows',
              'Resizable Columns',
              'Pinnable Columns',
              'Sticky Header',
              'Column Controls',
              'Card Container',
              'Column Visibility',
              'Loading Skeleton',
              'CRUD',
            ],
          },
        },
        {
          title: 'Date Picker',
          href: '/docs/date-picker',
          update: true,
          highlight: {
            order: 11,
            examples: ['Default', 'Range', 'Presets'],
          },
        },
        {
          title: 'Dialog',
          href: '/docs/dialog',
          highlight: {
            examples: ['Default', 'No Overlay', 'Scrollable', 'Fullscreen'],
          },
        },
        {
          title: 'Drawer',
          href: '/docs/drawer',
        },
        {
          title: 'Dropdown Menu',
          href: '/docs/dropdown-menu',
          highlight: {
            examples: ['Default', 'Checkbox', 'Radio Group'],
          },
        },
        {
          title: 'Form',
          href: '/docs/form',
        },
        {
          title: 'File Upload',
          href: '/docs/file-upload',
          update: true,
        },
        {
          title: 'Hover Card',
          href: '/docs/hover-card',
        },
        {
          title: 'Input',
          href: '/docs/input',
          update: true,
          highlight: {
            order: 14,
            examples: ['Default', 'Disabled', 'Readonly', 'File', 'Size', 'Form'],
          },
        },
        {
          title: 'Kanban',
          href: '/docs/kanban',
          new: true,
        },
        {
          title: 'Kbd',
          href: '/docs/kbd',
          highlight: {
            order: 12,
            examples: ['Default', 'Outline', 'Size'],
          },
        },
        {
          title: 'Label',
          href: '/docs/label',
        },
        {
          title: 'Menubar',
          href: '/docs/menubar',
        },
        {
          title: 'Navigation Menu',
          href: '/docs/navigation-menu',
        },
        {
          title: 'Pagination',
          href: '/docs/pagination',
          highlight: {
            examples: ['Default', 'Icon', 'Card'],
          },
        },
        {
          title: 'Popover',
          href: '/docs/popover',
          highlight: {
            examples: ['Default'],
          },
        },
        {
          title: 'Progress',
          href: '/docs/progress',
          items: [],
        },
        {
          title: 'Radio Group',
          href: '/docs/radio-group',
          highlight: {
            examples: ['Default', 'Mono', 'Disabled', 'Form'],
          },
        },
        {
          title: 'Resizable',
          href: '/docs/resizable',
        },
        {
          title: 'Rating',
          href: '/docs/rating',
          new: true,
        },
        {
          title: 'Scroll Area',
          href: '/docs/scroll-area',
          highlight: {
            examples: ['Default'],
          },
        },
        {
          title: 'Stepper',
          href: '/docs/stepper',
        },
        {
          title: 'Scrollspy',
          href: '/docs/scrollspy',
        },
        {
          title: 'Select',
          href: '/docs/select',
          highlight: {
            examples: [
              'Default',
              'Group',
              'Disabled',
              'Disabled Option',
              'Size',
              'Indicator Position',
              'Custom Indicator',
              'Icon',
              'Status',
              'Badge',
              'Avatar',
              'Form',
            ],
          },
        },
        {
          title: 'Separator',
          href: '/docs/separator',
          highlight: {
            examples: ['Default'],
          },
        },
        {
          title: 'Sheet',
          href: '/docs/sheet',
          highlight: {
            order: 15,
            examples: ['Default', 'Scrollable', 'Side'],
          },
        },
        {
          title: 'Skeleton',
          href: '/docs/skeleton',
          highlight: {
            examples: ['Default'],
          },
        },
        {
          title: 'Slider',
          href: '/docs/slider',
          highlight: {
            examples: ['Default', 'Range', 'Tooltip', 'Input', 'Form'],
          },
        },
        {
          title: 'Sonner',
          href: '/docs/sonner',
          highlight: {
            examples: ['Default', 'Variants'],
          },
        },
        {
          title: 'Sortable',
          href: '/docs/sortable',
          new: true,
        },
        {
          title: 'Switch',
          href: '/docs/switch',
          highlight: {
            examples: [
              'Default',
              'Mono',
              'Disabled',
              'Square',
              'Size',
              'Indicator',
              'Icon',
              'Button',
              'Advanced Label',
              'Form',
            ],
          },
        },
        {
          title: 'Table',
          href: '/docs/table',
          highlight: {
            examples: ['Default', 'Vertical'],
          },
        },
        {
          title: 'Tabs',
          href: '/docs/tabs',
          highlight: {
            examples: [
              'Default',
              'Icon',
              'Badge',
              'Button',
              'Pill',
              'Line',
              'Vertical',
              'Size Large',
              'Size Medium',
              'Size Small',
              'Size Xsmall',
              'Disabled',
            ],
          },
        },
        /*
        {
          title: 'Tag',
          href: '/docs/tag',
          new: true,
        },
        */
        {
          title: 'Textarea',
          href: '/docs/textarea',
          highlight: {
            examples: ['Default', 'Disabled', 'Readonly', 'Size', 'Form'],
          },
        },
        {
          title: 'Tooltip',
          href: '/docs/tooltip',
          highlight: {
            examples: ['Default', 'Light', 'Side'],
          },
        },
        {
          title: 'Toggle',
          href: '/docs/toggle',
        },
        {
          title: 'Toggle Group',
          href: '/docs/toggle-group',
        },
        {
          title: 'Tree',
          href: '/docs/tree',
        },
      ],
    },

    {
      title: 'Base UI Components',
      items: [
        {
          title: 'Accordion',
          href: '/docs/base-accordion',
          new: true,
        },
        {
          title: 'Alert Dialog',
          href: '/docs/base-alert-dialog',
          new: true,
        },
        {
          title: 'Autocomplete',
          href: '/docs/base-autocomplete',
          new: true,
        },
        {
          title: 'Avatar',
          href: '/docs/base-avatar',
          new: true,
        },
        {
          title: 'Badge',
          href: '/docs/base-badge',
          new: true,
        },
        {
          title: 'Breadcrumb',
          href: '/docs/base-breadcrumb',
          new: true,
        },
        {
          title: 'Button',
          href: '/docs/base-button',
          new: true,
        },
        {
          title: 'Checkbox',
          href: '/docs/base-checkbox',
          new: true,
        },
        {
          title: 'Collapsible',
          href: '/docs/base-collapsible',
          new: true,
        },
        {
          title: 'Input',
          href: '/docs/base-input',
          new: true,
        },
        {
          title: 'Menu',
          href: '/docs/base-menu',
          new: true,
        },
        {
          title: 'Menubar',
          href: '/docs/base-menubar',
          new: true,
        },
      ],
    },

    {
      title: 'Special Effects',
      items: [
        {
          title: 'Marquee',
          href: '/docs/marquee',
        },
        {
          title: 'GitHub Button',
          href: '/docs/github-button',
        },
        {
          title: 'Avatar Group',
          href: '/docs/avatar-group',
        },
      ],
    },
    {
      title: 'Text Animations',
      items: [
        {
          title: 'Typing Text',
          href: '/docs/typing-text',
        },
        {
          title: 'Word Rotate',
          href: '/docs/word-rotate',
        },
        {
          title: 'Video Text',
          href: '/docs/video-text',
        },
        {
          title: 'SVG Text',
          href: '/docs/svg-text',
        },
        {
          title: 'Counting Number',
          href: '/docs/counting-number',
        },
        {
          title: 'Sliding Number',
          href: '/docs/sliding-number',
        },
        {
          title: 'Shimmering Text',
          href: '/docs/shimmering-text',
        },
        {
          title: 'Text Reveal',
          href: '/docs/text-reveal',
        },
      ],
    },
    {
      title: 'Background Effects',
      items: [
        {
          title: 'Gradient Background',
          href: '/docs/gradient-background',
        },
        {
          title: 'Grid Background',
          href: '/docs/grid-background',
        },
        {
          title: 'Hover Background',
          href: '/docs/hover-background',
        },
      ],
    },
  ],
  footerNav: [
    {
      title: 'Github',
      icon: 'github',
      href: 'https://github.com/keenthemes/reui',
    },
    {
      title: 'X',
      icon: 'twitter',
      href: 'https://x.com/reui_io',
    },
  ],
};
