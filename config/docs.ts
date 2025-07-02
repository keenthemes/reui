import { siteConfig } from './site';
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
      title: 'Blocks',
      href: '/blocks',
    },
    {
      title: 'Themes',
      href: '/themes',
    },
    {
      title: 'Docs',
      href: '/docs',
    },
    {
      title: 'Changelog',
      href: '/docs/changelog',
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
          new: true,
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
          title: 'Changelog - v' + siteConfig.version,
          href: '/docs/changelog',
          items: [],
        },
      ],
    },

    {
      title: 'Templates',
      items: [
        {
          title: 'Metronic',
          href: 'https://keenthemes.com/metronic?utm_source=reui_website&utm_medium=menu&utm_campaign=product_link&utm_content=metronic',
          external: true,
          popular: true,
          items: [],
        },
        {
          title: 'SaaSify',
          href: 'https://keenthemes.com/products/saasify?utm_source=reui_website&utm_medium=menu&utm_campaign=product_link&utm_content=saasify',
          new: true,
          items: [],
        },
        {
          title: 'Storely',
          href: 'https://keenthemes.com/products/storely?utm_source=reui_website&utm_medium=menu&utm_campaign=product_link&utm_content=storely',
          new: true,
          items: [],
        },
        {
          title: 'Shoplit',
          href: 'https://keenthemes.com/products/shoplit?utm_source=reui_website&utm_medium=menu&utm_campaign=product_link&utm_content=shoplit',
          external: true,
          items: [],
        },
        {
          title: 'Supastart',
          href: 'https://keenthemes.com/products/supastart?utm_source=reui_website&utm_medium=menu&utm_campaign=product_link&utm_content=supastart',
          external: true,
          items: [],
        },
      ],
    },

    {
      title: 'Base UI Components',
      items: [
        {
          title: 'Accordion',
          href: '/docs/base-accordion',
        },
        {
          title: 'Alert Dialog',
          href: '/docs/base-alert-dialog',
        },
        {
          title: 'Avatar',
          href: '/docs/base-avatar',
        },
        {
          title: 'Badge',
          href: '/docs/base-badge',
        },
        {
          title: 'Breadcrumb',
          href: '/docs/base-breadcrumb',
        },
        {
          title: 'Button',
          href: '/docs/base-button',
        },
        {
          title: 'Checkbox',
          href: '/docs/base-checkbox',
        },
        {
          title: 'Collapsible',
          href: '/docs/base-collapsible',
        },
        {
          title: 'Input',
          href: '/docs/base-input',
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
          update: true,
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
          update: true,
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
          title: 'Code',
          href: '/docs/code',
          new: true,
        },
        {
          title: 'Data Grid',
          href: '/docs/data-grid',
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
          title: 'Dropdown Menu',
          href: '/docs/dropdown-menu',
          highlight: {
            examples: ['Default', 'Checkbox', 'Radio Group'],
          },
        },
        {
          title: 'File Upload',
          href: '/docs/file-upload',
          new: true,
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
          title: 'Kbd',
          href: '/docs/kbd',
          highlight: {
            order: 12,
            examples: ['Default', 'Outline', 'Size'],
          },
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
          update: true,
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
          title: 'Scroll Area',
          href: '/docs/scroll-area',
          highlight: {
            examples: ['Default'],
          },
        },
        {
          title: 'Stepper',
          href: '/docs/stepper',
          new: true,
        },
        {
          title: 'Scrollspy',
          href: '/docs/scrollspy',
          new: true,
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
          title: 'Toggle Group',
          href: '/docs/toggle-group',
        },
        {
          title: 'Tree',
          href: '/docs/tree',
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
          new: true,
        },
        {
          title: 'GitHub Button',
          href: '/docs/github-button',
          new: true,
        },
        {
          title: 'Avatar Group',
          href: '/docs/avatar-group',
          new: true,
        },
      ],
    },
    {
      title: 'Text Animations',
      items: [
        {
          title: 'Typing Text',
          href: '/docs/typing-text',
          new: true,
        },
        {
          title: 'Word Rotate',
          href: '/docs/word-rotate',
          new: true,
        },
        {
          title: 'Video Text',
          href: '/docs/video-text',
          new: true,
        },
        {
          title: 'SVG Text',
          href: '/docs/svg-text',
          new: true,
        },
        {
          title: 'Counting Number',
          href: '/docs/counting-number',
          new: true,
        },
        {
          title: 'Sliding Number',
          href: '/docs/sliding-number',
          new: true,
        },
        {
          title: 'Shimmering Text',
          href: '/docs/shimmering-text',
          new: true,
        },
        {
          title: 'Text Reveal',
          href: '/docs/text-reveal',
          new: true,
        },
      ],
    },
    {
      title: 'Background Effects',
      items: [
        {
          title: 'Gradient Background',
          href: '/docs/gradient-background',
          new: true,
        },
        {
          title: 'Grid Background',
          href: '/docs/grid-background',
          new: true,
        },
        {
          title: 'Hover Background',
          href: '/docs/hover-background',
          new: true,
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
