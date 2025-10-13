import { Suspense } from 'react';
import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/registry/default/lib/utils';
import { Toaster as Sooner } from '@/registry/default/ui/sonner';
import { META_THEME_COLORS, siteConfig } from '@/config/site';
import { QueryProvider } from '@/providers/query-provider';
import { Analytics } from '@/components/analytics';
import { ThemeProvider } from '@/components/providers';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    'Tailwind',
    'Tailwind CSS',
    'Next.js',
    'React',
    'Radix UI',
    'Tanstack Table',
    'React Templates',
    'Next.js Templates',
    'React Components',
    'Motion',
    'Headless Components',
    'Accordion',
    'Alert',
    'Alert Dialog',
    'Aspect Ratio',
    'Avatar',
    'Badge',
    'Breadcrumb',
    'Button',
    'Calendar',
    'Card',
    'Chart',
    'Checkbox',
    'Collapsible',
    'Command',
    'Context Menu',
    'Data Grid',
    'Data Grid Table',
    'Data Grid Drag & Drop',
    'Dialog',
    'Drawer',
    'Dropdown Menu',
    'Form',
    'Hover Card',
    'Input',
    'Input OTP',
    'KBD',
    'Label',
    'List',
    'Menubar',
    'Navigation Menu',
    'Nested Menu',
    'Pagination',
    'Popover',
    'Progress',
    'Radio Group',
    'Resizable',
    'Scroll Area',
    'Scrollspy',
    'React Select',
    'Separator',
    'Scrollspy',
    'Sheet',
    'Skeleton',
    'Slider',
    'Sonner',
    'Spinners',
    'Switch',
    'Table',
    'Tabs',
    'Textarea',
    'Toggle',
    'Toggle Group',
    'Tooltip',
  ],
  authors: [
    {
      name: 'reui',
      url: 'https://reui.io',
    },
  ],
  creator: '@reui_io',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['https://reui.io/brand/logo-default.png'],
    creator: '@reui_io',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
              }
            } catch (_) {}
          `,
          }}
        />
      </head>
      <body
        className={cn('min-h-screen text-base text-foreground bg-background antialiased font-sans', inter.className)}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme>
          <QueryProvider>
            <Suspense>
              <>{children}</>
              <Analytics />
              <Sooner />
            </Suspense>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
