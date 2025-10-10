'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/registry/default/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { sitemapConfig } from '@/config/sitemap';
import { MainNavItem } from '@/config/types';
import { trackEvent } from '@/lib/analytics';

export function MainNav() {
  const pathname = usePathname();

  const handleMenuClick = (item: MainNavItem) => {
    trackEvent({
      name: `site_header_menu_${item.title.toLowerCase().replace(/\s+/g, '_')}_link_click`,
      properties: {
        menu_item: item.title,
        menu_path: item.href || '#',
        is_external: !!item.external,
        category: 'navigation',
        label: `Header Menu ${item.title} Click`,
      },
    });
  };

  return (
    <div className="itesm-center justify-center mr-4 hidden lg:flex">
      <nav className="flex items-center gap-4 text-sm font-medium xl:gap-6">
        {sitemapConfig.mainNav.map((item: MainNavItem) => (
          <Link
            key={item.href}
            href={item.href || '#'}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            onClick={() => handleMenuClick(item)}
            className={cn(
              'relative transition-colors hover:text-foreground/80 inline-flex items-center gap-1',
              item.href && (item.href === pathname || (item.href !== '/' && pathname?.startsWith(item.href)))
                ? 'text-foreground'
                : 'text-foreground/60',
            )}
          >
            {item.title}
            {item.external && <ArrowUpRight className="size-3.5 opacity-60" />}
          </Link>
        ))}
      </nav>
    </div>
  );
}
