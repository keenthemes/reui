'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/registry/default/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/registry/default/ui/accordion';
import { Badge } from '@/registry/default/ui/badge';
import { siteConfig } from '@/config/site';
import { type SitemapConfig } from '@/config/sitemap';
import { SidebarNavItem } from '@/config/types';

export interface DocsSidebarNavProps {
  config: SitemapConfig;
}

// Helper function to check if an item or its children match the current pathname
function checkItemPath(item: SidebarNavItem, pathname: string | null): boolean {
  if (!pathname) return false;

  // Check if current item matches
  if (item.href === pathname) return true;

  // Check if any children match
  const children = item.items || item.children || [];
  return children.some((child) => checkItemPath(child, pathname));
}

export function DocsSidebarNavAccordion({ config }: DocsSidebarNavProps) {
  const pathname = usePathname();

  const items = config.docsNav;

  // Find which accordion item should be expanded based on current pathname
  const getExpandedItem = (): string | undefined => {
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (checkItemPath(item, pathname)) {
        return `item-${index}`;
      }
    }
    return undefined;
  };

  return items.length ? (
    <div className="w-full">
      <Accordion type="single" className="w-full" collapsible defaultValue={getExpandedItem()}>
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-none">
            <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">{item.title}</AccordionTrigger>
            <AccordionContent className="pb-4">
              {item?.items?.length && <DocsSidebarNavItems items={item.items} pathname={pathname} />}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ) : null;
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
}

export function DocsSidebarNavItems({ items, pathname }: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="space-y-1">
      {items.map((item, index) => {
        // Check if item has nested children (2-level submenu)
        const hasChildren = item.items?.length || item.children?.length;
        const children = item.items || item.children || [];

        if (hasChildren) {
          // Check if this submenu should be expanded based on current pathname
          const shouldExpand = checkItemPath(item, pathname);

          return (
            <Accordion
              key={index}
              type="single"
              className="w-full"
              collapsible
              defaultValue={shouldExpand ? `subitem-${index}` : undefined}
            >
              <AccordionItem value={`subitem-${index}`} className="border-none">
                <AccordionTrigger className="py-1 text-sm font-medium hover:no-underline">
                  <span
                    className={cn('flex items-center gap-2', pathname === item.href && 'text-primary font-semibold')}
                  >
                    {item.title}
                    {item.label && (
                      <Badge variant="success" size="sm" appearance="light">
                        {item.label}
                      </Badge>
                    )}
                    {item.new && (
                      <Badge variant="success" size="sm" appearance="light">
                        New
                      </Badge>
                    )}
                    {item.popular && (
                      <Badge variant="info" size="sm" appearance="light">
                        Popular
                      </Badge>
                    )}
                    {item.changelog && (
                      <Badge variant="primary" size="sm" appearance="light">
                        v{siteConfig.version}
                      </Badge>
                    )}
                    {item.premium && (
                      <Badge variant="info" size="sm" appearance="light">
                        Premium
                      </Badge>
                    )}
                    {item.update && (
                      <Badge variant="warning" size="sm" appearance="light">
                        Update
                      </Badge>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="ml-4 space-y-1">
                    {item.href && (
                      <Link
                        href={item.href}
                        className={cn(
                          'block py-1 text-sm text-muted-foreground hover:text-foreground',
                          pathname === item.href && 'text-primary font-semibold',
                        )}
                        target={item.external ? '_blank' : ''}
                        rel={item.external ? 'noreferrer' : ''}
                      >
                        Overview
                      </Link>
                    )}
                    {children.map((child, childIndex) =>
                      child.href && !child.disabled ? (
                        <Link
                          key={childIndex}
                          href={child.href}
                          className={cn(
                            'block py-1 text-sm text-muted-foreground hover:text-foreground',
                            child.disabled && 'cursor-not-allowed opacity-60',
                            pathname === child.href && 'text-primary font-semibold',
                          )}
                          target={child.external ? '_blank' : ''}
                          rel={child.external ? 'noreferrer' : ''}
                        >
                          {child.title}
                          {child.label && (
                            <Badge variant="success" size="sm" appearance="light" className="ml-2">
                              {child.label}
                            </Badge>
                          )}
                          {child.new && (
                            <Badge variant="success" size="sm" appearance="light" className="ml-2">
                              New
                            </Badge>
                          )}
                          {child.popular && (
                            <Badge variant="info" size="sm" appearance="light" className="ml-2">
                              Popular
                            </Badge>
                          )}
                          {child.changelog && (
                            <Badge variant="primary" size="sm" appearance="light" className="ml-2">
                              v{siteConfig.version}
                            </Badge>
                          )}
                          {child.premium && (
                            <Badge variant="info" size="sm" appearance="light" className="ml-2">
                              Premium
                            </Badge>
                          )}
                          {child.update && (
                            <Badge variant="warning" size="sm" appearance="light" className="ml-2">
                              Update
                            </Badge>
                          )}
                        </Link>
                      ) : (
                        <span
                          key={childIndex}
                          className={cn(
                            'block py-1 text-sm text-muted-foreground',
                            child.disabled && 'cursor-not-allowed opacity-60',
                          )}
                        >
                          {child.title}
                          {child.label && (
                            <Badge variant="success" size="sm" appearance="light" className="ml-2">
                              {child.label}
                            </Badge>
                          )}
                        </span>
                      ),
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        }

        // Regular single-level item
        return item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              'flex w-full items-center justify-between gap-2 py-1 text-sm font-normal text-foreground hover:text-text-primary',
              item.disabled && 'cursor-not-allowed opacity-60',
              pathname === item.href && 'text-primary font-semibold',
            )}
            target={item.external ? '_blank' : ''}
            rel={item.external ? 'noreferrer' : ''}
          >
            <span>{item.title}</span>
            <div className="flex gap-1">
              {item.label && (
                <Badge variant="success" size="sm" appearance="light">
                  {item.label}
                </Badge>
              )}
              {item.new && (
                <Badge variant="success" size="sm" appearance="light">
                  New
                </Badge>
              )}
              {item.popular && (
                <Badge variant="info" size="sm" appearance="light">
                  Popular
                </Badge>
              )}
              {item.changelog && (
                <Badge variant="primary" size="sm" appearance="light">
                  v{siteConfig.version}
                </Badge>
              )}
              {item.premium && (
                <Badge variant="info" size="sm" appearance="light">
                  Premium
                </Badge>
              )}
              {item.update && (
                <Badge variant="warning" size="sm" appearance="light">
                  Update
                </Badge>
              )}
            </div>
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              'flex w-full cursor-not-allowed items-center justify-between gap-2 py-1 text-sm text-muted-foreground',
              item.disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <span>{item.title}</span>
            {item.label && (
              <Badge variant="success" size="sm" appearance="light">
                {item.label}
              </Badge>
            )}
          </span>
        );
      })}
    </div>
  ) : null;
}
