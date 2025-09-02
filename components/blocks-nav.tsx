'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/registry/default/ui/badge';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { blocksConfig } from '@/config/blocks';
import { BlockPrimaryCategory, BlocksConfig, BlockSecondaryCategory } from '@/config/types';
import { getPrimaryCategory, getSecondaryCategory } from '@/lib/blocks';
import { cn } from '@/lib/utils';

export function BlocksNav() {
  const pathname = usePathname();
  const primaryCategory = getPrimaryCategory(pathname);
  const secondaryCategory = getSecondaryCategory(primaryCategory, pathname);

  // Function to render secondary categories (level 0)
  const renderPrimaryCategory = (category: BlockPrimaryCategory, parentSlug: string, index: number) => {
    const categorySlug = `${parentSlug}/${category.slug}`;
    const itemPath = `/blocks/${categorySlug}`;

    // Check if this category is active based on passed props
    const isActive = primaryCategory?.slug === category.slug;

    // Check if category has content
    const hasContent = category.sub && category.sub.length > 0;

    if (!hasContent) return null;

    return (
      <Link
        key={category.slug || index}
        href={!category.published ? '#' : itemPath}
        className={cn(
          'group flex items-center gap-2 px-0 py-2.5 text-sm transition-colors',
          'font-medium border-l-2 border-transparent',
          isActive && 'font-semibold text-foreground',
        )}
      >
        <span>{category.title}</span>
      </Link>
    );
  };

  // Function to render tertiary categories (level 1)
  const renderSecondaryCategory = (category: BlockSecondaryCategory, parentSlug: string, index: number) => {
    const categorySlug = `${parentSlug}/${category.slug}`;
    const itemPath = `/blocks/${categorySlug}`;

    // Check if this category is active based on passed props
    const isActive = secondaryCategory?.slug === category.slug;

    return (
      <Link
        key={category.slug || index}
        href={!category.published ? '#' : itemPath}
        className={cn(
          'group relative flex items-center gap-2 px-3.5 py-1 text-sm transition-colors text-muted-foreground ml-[2px] border-l border-transparent',
          'hover:text-foreground hover:border-muted-foreground/50',
          isActive && 'font-semibold text-foreground border-muted-foreground',
          category.published ? 'text-foreground' : 'text-muted-foreground',
          !category.published && 'hover:text-muted-foreground hover:border-transparent opacity-90',
        )}
      >
        <span className="truncate">{category.title}</span>
        {!category.published && (
          <Badge
            variant="warning"
            size="sm"
            appearance="light"
            className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 ml-auto"
          >
            Soon
          </Badge>
        )}
        {category.new && (
          <Badge variant="success" size="sm" appearance="light" className="ml-auto">
            New
          </Badge>
        )}
      </Link>
    );
  };

  // Helper function to render secondary categories and their tertiary children
  const renderNav = (categories: BlocksConfig) => {
    return categories
      .map((category, index) => {
        const categorySlug = `${category.slug}`;

        // Render secondary category
        const categoryElement = renderPrimaryCategory(category, categorySlug, index);

        // If this category has tertiary categories, render them grouped under this category
        if (category.sub && category.sub.length > 0) {
          return (
            <div key={category.slug || index} className="space-y-1">
              {categoryElement}

              {/* Render secondary categories */}
              <div className="relative">
                <div className="before:content-[''] before:absolute before:left-0 before:top-0 before:block before:w-px before:h-full before:bg-border before:ml-0.5">
                  {category.sub.map((secondaryCategory, secondaryIndex) =>
                    renderSecondaryCategory(secondaryCategory, categorySlug, secondaryIndex),
                  )}
                </div>
              </div>
            </div>
          );
        }

        // If no tertiary categories, just render the secondary category element
        return categoryElement;
      })
      .filter(Boolean);
  };

  return (
    <div className="w-full grow px-1 py-2.5">
      <ScrollArea className="lg:h-[calc(100vh-10rem)] px-4">
        <div className="space-y-5">{renderNav(blocksConfig)}</div>
      </ScrollArea>
    </div>
  );
}
