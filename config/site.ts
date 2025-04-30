export interface NavItem {
  title: string;
  href?: string;
  external?: boolean;
  children?: NavItem[];
}

export interface SiteConfig {
  name: string;
  url: string;
  ogImage: string;
  description: string;
  links: {
    privacy: string;
    twitter: string;
    github: string;
    suggestions: string;
  };
  nav: NavItem[];
}

export const siteConfig = {
  name: 'ReUI',
  url: 'https://reui.io',
  ogImage: 'https://reui.io/og.jpg',
  description:
    'An open-source collection of copy-and-paste UI components and fully functional apps build with React, Next.js and Tailwind CSS',
  links: {
    twitter: 'https://x.com/reui_io',
    github: 'https://github.com/keenthemes/reui',
    suggestions:
      'https://github.com/keenthemes/reui/discussions/categories/suggestions',
  },
  nav: [
    {
      title: 'Components',
      href: 'https://reui.io/components',
      external: true,
    },
    {
      title: 'Docs',
      href: 'https://reui.io/docs',
      external: true,
    },
    {
      title: 'Store',
      href: 'https://keenthemes.com/',
      external: true,
    },
  ],
};
