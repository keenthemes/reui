import { FooterNavItem, MainNavItem, SidebarNavItem } from './types';

export interface SitemapConfig {
  mainNav: MainNavItem[];
  docsNav: SidebarNavItem[];
  footerNav: FooterNavItem[];
}

export const sitemapConfig: SitemapConfig = {
  mainNav: [
    {
      title: 'Components',
      href: '/',
      description:
        'Browse and explore the complete collection of ReUI components with live examples and code snippets.',
    },
    {
      title: 'UI Blocks',
      href: '/blocks',
      description: 'Pre-built UI blocks and page templates that showcase ReUI components in real-world layouts.',
    },
    {
      title: 'Docs',
      href: '/docs',
      description: 'Comprehensive documentation covering installation, theming, and advanced usage patterns.',
    },
    {
      title: 'Changelog',
      href: '/docs/changelog',
      description: 'Track the latest updates, new features, and breaking changes in ReUI releases.',
    },
    {
      title: 'Built with ReUI',
      href: '/built-with-reui',
      description: 'Discover applications and websites built using ReUI components for inspiration.',
    },
  ],
  docsNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
          description:
            'Get started with ReUI - a comprehensive React component library designed for modern web applications.',
        },
        {
          title: 'Installation',
          href: '/docs/installation',
          description: 'Step-by-step guide to install ReUI in your React project with npm, yarn, or pnpm.',
        },
        {
          title: 'Registry',
          href: '/docs/registry',
          description: 'Learn how to use the ReUI Registry with shadcn/ui.',
        },
        {
          title: 'MCP',
          href: '/docs/mcp',
          description: 'Learn how to use the shadcn MCP(Model Context Protocol) with ReUI',
        },
        {
          title: 'Theming',
          href: '/docs/theming',
          description:
            'Customize ReUI components with CSS variables, Tailwind CSS, or your preferred styling solution.',
        },
        {
          title: 'Dark mode',
          href: '/docs/dark-mode',
          description:
            'Implement automatic dark mode switching with ReUI components using next-themes or custom solutions.',
        },
        {
          title: 'RTL',
          href: '/docs/rtl',
          description:
            'Enable right-to-left language support for ReUI components in Arabic, Hebrew, and other RTL languages.',
        },
        {
          title: 'References',
          href: '/docs/references',
          description: '3rd-party component libraries and tool used to build ReUI.',
        },
        {
          title: 'Changelog',
          changelog: true,
          href: '/docs/changelog',
          description:
            'Detailed changelog tracking new features, bug fixes, and breaking changes across ReUI versions.',
        },
        {
          title: 'llms.txt',
          href: '/llms.txt',
          external: true,
          description: 'Structured data file for AI assistants and language models to understand ReUI components.',
        },
      ],
    },
    {
      title: 'UI Components',
      items: [
        {
          title: 'Alert',
          href: '/docs/alert',
          description:
            'Display contextual feedback messages with multiple variants including success, warning, error, and info states.',
        },
        {
          title: 'Calendar',
          href: '/docs/calendar',
          description:
            'Interactive date picker with month navigation, date selection, and customizable date ranges for scheduling interfaces.',
        },
        {
          title: 'Card',
          href: '/docs/card',
          description:
            'Flexible container component for displaying content with headers, footers, and customizable layouts.',
        },
        {
          title: 'Chart',
          href: '/docs/chart',
          description:
            'Data visualization component built on Recharts with support for line, bar, pie, and area charts.',
        },
        {
          title: 'Data Grid',
          href: '/docs/data-grid',
          update: true,
          description:
            'Advanced managed table component build with TanStack Table with sorting, filtering, pagination, and row selection for complex data management.',
        },
        {
          title: 'Drawer',
          href: '/docs/drawer',
          description:
            'Slide-out panel component that appears from the side with overlay and customizable positioning.',
        },
        {
          title: 'File Upload',
          href: '/docs/file-upload',
          description:
            'Drag-and-drop file upload component with progress indicators, file validation, and multiple file support.',
        },
        {
          title: 'Kanban',
          href: '/docs/kanban',
          description: 'Project management board with draggable cards, customizable columns, and real-time updates.',
        },
        {
          title: 'Kbd',
          href: '/docs/kbd',
          description: 'Keyboard key indicator component for displaying keyboard shortcuts and key combinations.',
        },
        {
          title: 'Pagination',
          href: '/docs/pagination',
          description:
            'Navigate through large datasets with page numbers, previous/next buttons, and customizable page sizes.',
        },
        {
          title: 'Resizable',
          href: '/docs/resizable',
          description: 'Create resizable panels and layouts with drag handles and customizable resize constraints.',
        },
        {
          title: 'Rating',
          href: '/docs/rating',
          description:
            'Interactive star rating component for collecting user feedback with half-star support and custom icons.',
        },
        {
          title: 'Stepper',
          href: '/docs/stepper',
          description:
            'Multi-step process component with progress indicators, step validation, and customizable navigation.',
        },
        {
          title: 'Scrollspy',
          href: '/docs/scrollspy',
          description:
            'Navigation component that highlights menu items based on scroll position for long-form content.',
        },
        {
          title: 'Skeleton',
          href: '/docs/skeleton',
          description: 'Loading placeholder component that mimics content structure while data is being fetched.',
        },
        {
          title: 'Sortable',
          href: '/docs/sortable',
          description:
            'Drag-and-drop list component for reordering items with visual feedback and accessibility support.',
        },
        {
          title: 'Sonner',
          href: '/docs/sonner',
          description: 'Toast notification system with multiple positions, types, and customizable animations.',
        },
        {
          title: 'Table',
          href: '/docs/table',
          description:
            'Structured data display component with sorting, filtering, and responsive design for tabular information.',
        },
        {
          title: 'Textarea',
          href: '/docs/textarea',
          description: 'Multi-line text input component with auto-resize, character counting, and validation support.',
        },
      ],
    },
    {
      title: 'Radix UI Components',
      items: [
        {
          title: 'Accordion',
          href: '/docs/accordion',
          description: 'Displays collapsible content sections with smooth animations and keyboard navigation support.',
        },
        {
          title: 'Accordion Menu',
          href: '/docs/accordion-menu',
          description:
            'Navigation component with expandable sections, perfect for sidebar menus and hierarchical navigation.',
        },
        {
          title: 'Alert Dialog',
          href: '/docs/alert-dialog',
          description:
            'Modal dialog that interrupts user workflow to deliver important messages requiring immediate attention.',
        },
        {
          title: 'Avatar',
          href: '/docs/avatar',
          description: 'User image component with fallback initials, status indicators, and customizable sizing.',
        },
        {
          title: 'Badge',
          href: '/docs/badge',
          description:
            'Small status indicator for notifications, counts, and labels with multiple color variants and sizes.',
        },
        {
          title: 'Breadcrumb',
          href: '/docs/breadcrumb',
          description:
            'Navigation trail showing current page location with customizable separators and responsive design.',
        },
        {
          title: 'Button',
          href: '/docs/button',
          description:
            'Interactive element with multiple variants, sizes, and states for user actions and form submissions.',
        },
        {
          title: 'Carousel',
          href: '/docs/carousel',
          description:
            'Image gallery and content slider with touch gestures, autoplay, and customizable navigation controls.',
        },
        {
          title: 'Checkbox',
          href: '/docs/checkbox',
          description:
            'Form input for multiple selections with indeterminate state, custom styling, and accessibility features.',
        },
        {
          title: 'Collapsible',
          href: '/docs/collapsible',
          description: 'Content that can be shown or hidden with smooth animations and keyboard accessibility.',
        },
        {
          title: 'Command',
          href: '/docs/command',
          description:
            'Command palette interface with search, keyboard navigation, and customizable command execution.',
        },
        {
          title: 'Combobox',
          href: '/docs/combobox',
          description:
            'Searchable select input combining text input with dropdown list for enhanced user selection experience.',
        },
        {
          title: 'Context Menu',
          href: '/docs/context-menu',
          description:
            'Right-click menu that appears at cursor position with customizable actions and keyboard shortcuts.',
        },
        {
          title: 'Date Picker',
          href: '/docs/date-picker',
          description:
            'Calendar interface for date selection with range picking, keyboard navigation, and localization support.',
        },
        {
          title: 'Dialog',
          href: '/docs/dialog',
          description:
            'Modal overlay that captures focus and requires user interaction before dismissing or continuing.',
        },
        {
          title: 'Dropdown Menu',
          href: '/docs/dropdown-menu',
          description: 'Action menu that appears below a trigger with keyboard navigation and submenu support.',
        },
        {
          title: 'Form',
          href: '/docs/form',
          description:
            'Form container with built-in validation, error handling, and integration with popular form libraries.',
        },
        {
          title: 'Hover Card',
          href: '/docs/hover-card',
          description: 'Contextual information panel that appears on hover with customizable delay and positioning.',
        },
        {
          title: 'Input',
          href: '/docs/input',
          update: true,
          description: 'Text input field with validation states, error messages, and customizable styling options.',
        },
        {
          title: 'Label',
          href: '/docs/label',
          description: 'Form field label with automatic association to inputs and screen reader accessibility.',
        },
        {
          title: 'Menubar',
          href: '/docs/menubar',
          description: 'Application menu bar with nested menus, keyboard shortcuts, and cross-platform behavior.',
        },
        {
          title: 'Navigation Menu',
          href: '/docs/navigation-menu',
          description: 'Website navigation with dropdown menus, keyboard navigation, and responsive mobile behavior.',
        },
        {
          title: 'Popover',
          href: '/docs/popover',
          description:
            'Floating content panel anchored to a trigger with customizable positioning and collision detection.',
        },
        {
          title: 'Progress',
          href: '/docs/progress',
          description: 'Visual indicator showing task completion status with customizable appearance and animation.',
        },
        {
          title: 'Radio Group',
          href: '/docs/radio-group',
          description: 'Single-choice selection group with keyboard navigation and proper form association.',
        },
        {
          title: 'Scroll Area',
          href: '/docs/scroll-area',
          description: 'Custom scrollable container with styled scrollbars and smooth scrolling behavior.',
        },
        {
          title: 'Select',
          href: '/docs/select',
          description: 'Dropdown selection component with search, keyboard navigation, and customizable options.',
        },
        {
          title: 'Separator',
          href: '/docs/separator',
          description: 'Visual divider element with screen reader accessibility and customizable orientation.',
        },
        {
          title: 'Sheet',
          href: '/docs/sheet',
          description: 'Slide-out panel component with customizable positioning, animations, and overlay behavior.',
        },
        {
          title: 'Slider',
          href: '/docs/slider',
          description: 'Range input control with customizable steps, marks, and keyboard accessibility.',
        },
        {
          title: 'Sortable',
          href: '/docs/sortable',
          description: 'Drag-and-drop list reordering with visual feedback and keyboard accessibility support.',
        },
        {
          title: 'Switch',
          href: '/docs/switch',
          description: 'Toggle control for on/off states with smooth animations and keyboard accessibility.',
        },
        {
          title: 'Table',
          href: '/docs/table',
          description: 'Data table with sorting, filtering, and responsive design for structured information display.',
        },
        {
          title: 'Tabs',
          href: '/docs/tabs',
          description: 'Tabbed interface for organizing content with keyboard navigation and customizable styling.',
        },
        {
          title: 'Tooltip',
          href: '/docs/tooltip',
          description: 'Contextual hint that appears on hover or focus with customizable positioning and delay.',
        },
        {
          title: 'Toggle',
          href: '/docs/toggle',
          description: 'Two-state button control for toggling features with customizable pressed and unpressed states.',
        },
        {
          title: 'Toggle Group',
          href: '/docs/toggle-group',
          description: 'Group of toggle buttons with shared state management and single or multiple selection modes.',
        },
        {
          title: 'Tree',
          href: '/docs/tree',
          description: 'Hierarchical data display with expandable nodes, keyboard navigation, and customizable icons.',
        },
      ],
    },
    {
      title: 'Base UI Components',
      items: [
        {
          title: 'Accordion',
          href: '/docs/base-accordion',
          description:
            'Collapsible content sections with smooth expand/collapse animations and keyboard navigation support.',
        },
        {
          title: 'Alert Dialog',
          href: '/docs/base-alert-dialog',
          description:
            'Modal dialog that interrupts user workflow to deliver critical messages requiring immediate attention.',
        },
        {
          title: 'Autocomplete',
          href: '/docs/base-autocomplete',
          description: 'Smart input field with dynamic suggestions and filtered results based on user typing.',
        },
        {
          title: 'Avatar',
          href: '/docs/base-avatar',
          description:
            'User profile image component with fallback initials, status indicators, and flexible sizing options.',
        },
        {
          title: 'Badge',
          href: '/docs/base-badge',
          description:
            'Compact status indicator for notifications, counts, and categorical labels with color variants.',
        },
        {
          title: 'Breadcrumb',
          href: '/docs/base-breadcrumb',
          description:
            'Navigation trail showing current page location with customizable separators and responsive design.',
        },
        {
          title: 'Button',
          href: '/docs/base-button',
          description:
            'Interactive element with multiple variants, sizes, and states for user actions and form submissions.',
        },
        {
          title: 'Checkbox',
          href: '/docs/base-checkbox',
          description:
            'Form input for multiple selections with indeterminate state, custom styling, and accessibility features.',
        },
        {
          title: 'Collapsible',
          href: '/docs/base-collapsible',
          description: 'Content that can be shown or hidden with smooth animations and keyboard accessibility.',
        },
        {
          title: 'Combobox',
          href: '/docs/base-combobox',
          description:
            'Searchable select input combining text input with dropdown list for enhanced user selection experience.',
        },
        {
          title: 'Context Menu',
          href: '/docs/base-context-menu',
          description:
            'Right-click menu that appears at cursor position with customizable actions and keyboard shortcuts.',
        },
        {
          title: 'Dialog',
          href: '/docs/base-dialog',
          description:
            'Modal overlay that captures focus and requires user interaction before dismissing or continuing.',
        },
        {
          title: 'Input',
          href: '/docs/base-input',
          description: 'Text input field with validation states, error messages, and customizable styling options.',
        },
        {
          title: 'Menu',
          href: '/docs/base-menu',
          description: 'Action menu that appears below a trigger with keyboard navigation and submenu support.',
        },
        {
          title: 'Menubar',
          href: '/docs/base-menubar',
          description: 'Application menu bar with nested menus, keyboard shortcuts, and cross-platform behavior.',
        },
        {
          title: 'Meter',
          href: '/docs/base-meter',
          description: 'Visual indicator showing task completion status with customizable appearance and animation.',
        },
        {
          title: 'Navigation Menu',
          href: '/docs/base-navigation-menu',
          description: 'Website navigation with dropdown menus, keyboard navigation, and responsive mobile behavior.',
        },
        {
          title: 'Number Field',
          href: '/docs/base-number-field',
          description: 'Numeric input with increment/decrement controls, scrub area, and customizable step values.',
        },
        {
          title: 'Popover',
          href: '/docs/base-popover',
          description:
            'Floating content panel anchored to a trigger with customizable positioning and collision detection.',
        },
        {
          title: 'Preview Card',
          href: '/docs/base-preview-card',
          description: 'Contextual information panel that appears on hover with customizable delay and positioning.',
        },
        {
          title: 'Progress',
          href: '/docs/base-progress',
          description: 'Visual indicator showing task completion status with customizable appearance and animation.',
        },
        {
          title: 'Phone Input',
          href: '/docs/base-phone-input',
          description: 'International phone number input with country selection, formatting, and validation support.',
        },
        {
          title: 'Radio Group',
          href: '/docs/base-radio-group',
          description: 'Single-choice selection group with keyboard navigation and proper form association.',
        },
        {
          title: 'Select',
          href: '/docs/base-select',
          description: 'Dropdown selection component with search, keyboard navigation, and customizable options.',
        },
        {
          title: 'Separator',
          href: '/docs/base-separator',
          description: 'Visual divider element with screen reader accessibility and customizable orientation.',
        },
        {
          title: 'Switch',
          href: '/docs/base-switch',
          description: 'Toggle control for on/off states with smooth animations and keyboard accessibility.',
        },
        {
          title: 'Scroll Area',
          href: '/docs/base-scroll-area',
          description: 'Custom scrollable container with styled scrollbars and smooth scrolling behavior.',
        },
        {
          title: 'Slider',
          href: '/docs/base-slider',
          description: 'Range input control with customizable steps, marks, and keyboard accessibility.',
        },
        {
          title: 'Sheet',
          href: '/docs/base-sheet',
          description: 'Slide-out panel component with customizable positioning, animations, and overlay behavior.',
        },
        {
          title: 'Tabs',
          href: '/docs/base-tabs',
          description: 'Tabbed interface for organizing content with keyboard navigation and customizable styling.',
        },
        {
          title: 'Toast',
          href: '/docs/base-toast',
          description: 'Toast notification system with multiple positions, types, and customizable animations.',
        },
        {
          title: 'Toggle',
          href: '/docs/base-toggle',
          description: 'Two-state button control for toggling features with customizable pressed and unpressed states.',
        },
        {
          title: 'Toggle Group',
          href: '/docs/base-toggle-group',
          description: 'Group of toggle buttons with shared state management and single or multiple selection modes.',
        },
        {
          title: 'Toolbar',
          href: '/docs/base-toolbar',
          description: 'Container component that groups a set of buttons and controls for organized tool layouts.',
        },
        {
          title: 'Tooltip',
          href: '/docs/base-tooltip',
          description: 'Contextual hint that appears on hover or focus with customizable positioning and delay.',
        },
      ],
    },
    {
      title: 'Animated Components',
      items: [
        {
          title: 'Marquee',
          href: '/docs/marquee',
          description:
            'Scrolling text and content display with customizable speed, direction, and seamless loop animations.',
        },
        {
          title: 'GitHub Button',
          href: '/docs/github-button',
          description:
            'Interactive GitHub repository button with hover animations, star counts, and social integration features.',
        },
        {
          title: 'Avatar Group',
          href: '/docs/avatar-group',
          description:
            'Multiple user avatar display with overlap animations, hover effects, and customizable stacking patterns.',
        },
        {
          title: 'Typing Text',
          href: '/docs/typing-text',
          description:
            'Typewriter animation effect with customizable typing speed, cursor blinking, and character-by-character reveal.',
        },
        {
          title: 'Word Rotate',
          href: '/docs/word-rotate',
          description:
            'Rotating text animation that cycles through multiple words with smooth transitions and customizable timing.',
        },
        {
          title: 'Video Text',
          href: '/docs/video-text',
          description:
            'Video-based text effects using mask overlays and dynamic animations for immersive visual experiences.',
        },
        {
          title: 'SVG Text',
          href: '/docs/svg-text',
          description:
            'Animated SVG text with path drawing effects, morphing transitions, and vector-based animations.',
        },
        {
          title: 'Counting Number',
          href: '/docs/counting-number',
          description:
            'Animated number counter with easing functions, duration control, and smooth incremental transitions.',
        },
        {
          title: 'Sliding Number',
          href: '/docs/sliding-number',
          description:
            'Smooth number transitions with vertical sliding animations and customizable slide direction effects.',
        },
        {
          title: 'Shimmering Text',
          href: '/docs/shimmering-text',
          description:
            'Shimmer effect animation with customizable gradient colors, animation speed, and shimmer direction.',
        },
        {
          title: 'Text Reveal',
          href: '/docs/text-reveal',
          description:
            'Text reveal animations triggered by scroll position with intersection observer and customizable reveal effects.',
        },
        {
          title: 'Gradient Background',
          href: '/docs/gradient-background',
          description:
            'Animated gradient backgrounds with color transitions, movement effects, and customizable gradient patterns.',
        },
        {
          title: 'Grid Background',
          href: '/docs/grid-background',
          description:
            'Animated grid patterns with customizable spacing, movement effects, and dynamic grid line animations.',
        },
        {
          title: 'Hover Background',
          href: '/docs/hover-background',
          description:
            'Interactive backgrounds that respond to mouse movement, hover states, and cursor position with dynamic effects.',
        },
      ],
    },
  ],
  footerNav: [
    {
      title: 'Github',
      icon: 'github',
      href: 'https://github.com/keenthemes/reui',
      description: 'A high-quality React github component for building user interfaces.',
    },
    {
      title: 'X',
      icon: 'twitter',
      href: 'https://x.com/reui_io',
      description: 'A high-quality React x component for building user interfaces.',
    },
  ],
};
