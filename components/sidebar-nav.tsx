'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/registry/default/lib/utils';
import { Badge } from '@/registry/default/ui/badge';
import { type DocsConfig } from '@/config/docs';
import { SidebarNavItem } from '@/config/types';

export interface DocsSidebarNavProps {
  config: DocsConfig;
}

export function DocsSidebarNav({ config }: DocsSidebarNavProps) {
  const pathname = usePathname();

  const items = config.sidebarNav;

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn('pb-4')}>
          <h4 className="mb-0 rounded-md px-0 pt-2 pb-2 text-sm font-semibold">
            {item.title}
          </h4>
          {item?.items?.length && (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : null;
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              'relative transition-colors group flex w-full items-center justify-between px-0 gap-2 py-1 font-normal text-foreground hover:text-text-primary',
              item.disabled && 'cursor-not-allowed opacity-60',
              pathname === item.href && 'text-primary font-semibold',
            )}
            target={item.external ? '_blank' : ''}
            rel={item.external ? 'noreferrer' : ''}
          >
            {item.title}
            {item.label && (
              <Badge variant="success" size="sm" appearance="outline">
                {item.label}
              </Badge>
            )}
            {item.new && (
              <Badge variant="success" size="sm" appearance="outline">
                New
              </Badge>
            )}
            {item.popular && (
              <Badge variant="info" size="sm" appearance="outline">
                Popular
              </Badge>
            )}
            {item.update && (
              <Badge variant="warning" size="sm" appearance="outline">
                Update
              </Badge>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              'flex w-full cursor-not-allowed items-center justify-between rounded-md p-2 text-muted-foreground hover:underline',
              item.disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            {item.title}
            {item.label && (
              <Badge variant="success" size="sm" appearance="outline">
                {item.label}
              </Badge>
            )}
          </span>
        ),
      )}
    </div>
  ) : null;
}
