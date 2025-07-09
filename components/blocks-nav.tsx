'use client';

import Link from 'next/link';
import { BlockSecondaryCategory, BlockTertiaryCategory } from '@/config/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { usePathname } from 'next/navigation';
import { getPrimaryCategory, getSecondaryCategory, getTertiaryCategory } from '@/lib/blocks';

export default function BlocksNav() {
  const pathname = usePathname();
  const primaryCategory = getPrimaryCategory(pathname);
  const secondaryCategory = getSecondaryCategory(primaryCategory, pathname);
  const tertiaryCategory = getTertiaryCategory(secondaryCategory, pathname);
  
  // Use the primary category from the provider
  const currentCategory = primaryCategory;

  // Function to render secondary categories (level 0)
  const renderSecondaryCategory = (category: BlockSecondaryCategory, parentSlug: string, index: number) => {
    const categorySlug = `${parentSlug}/${category.slug}`;
    const itemPath = `/blocks/${categorySlug}`;
    
    // Check if this category is active based on passed props
    const isActive = secondaryCategory?.slug === category.slug;
    
    // Check if category has content
    const hasContent = category.sub && category.sub.length > 0;
    
    if (!hasContent) return null;

    return (
      <Link
        key={category.slug || index}
        href={itemPath}
        className={cn(
          "flex items-center gap-2 px-0 py-2.5 text-sm transition-colors",
          "font-medium border-l-2 border-transparent",
          isActive && "font-semibold text-foreground" 
        )}
      >
        <span>{category.title}</span>
      </Link>
    );
  };

  // Function to render tertiary categories (level 1)
  const renderTertiaryCategory = (category: BlockTertiaryCategory, parentSlug: string, index: number) => {
    const categorySlug = `${parentSlug}/${category.slug}`;
    const itemPath = `/blocks/${categorySlug}`;
    
    // Check if this category is active based on passed props
    const isActive = tertiaryCategory?.slug === category.slug;

    return (
      <Link
        key={category.slug || index}
        href={itemPath}
        className={cn(
          "relative flex items-center gap-2 px-3.5 py-1 text-sm transition-colors text-muted-foreground ml-[2px] border-l border-transparent",
          "hover:text-foreground hover:border-muted-foreground/50",
          isActive && "font-semibold text-foreground border-muted-foreground"
        )}
      >
        <span className="truncate">{category.title}</span>
      </Link>
    );
  };

  // Helper function to render secondary categories and their tertiary children
  const renderSecondaryNav = (categories: BlockSecondaryCategory[], parentSlug: string) => {
    return categories.map((category, index) => {
      const categorySlug = `${parentSlug}/${category.slug}`;
      
      // Check if category has content
      const hasContent = category.sub && category.sub.length > 0;
      
      if (!hasContent) return null;
      
      // Render secondary category
      const categoryElement = renderSecondaryCategory(category, parentSlug, index);
      
      // If this category has tertiary categories, render them grouped under this category
      if (category.sub && category.sub.length > 0) {
        return (
          <div key={category.slug || index} className="space-y-1">
            {categoryElement}
            <div className="relative">
              <div className="before:content-[''] before:absolute before:left-0 before:top-0 before:block before:w-px before:h-full before:bg-border before:ml-0.5">
                {category.sub.map((tertiaryCategory, tertiaryIndex) => 
                  renderTertiaryCategory(tertiaryCategory, categorySlug, tertiaryIndex)
                )}
              </div>
            </div>
          </div>
        );
      }
      
      // If no tertiary categories, just render the secondary category element
      return categoryElement;
    }).filter(Boolean);
  };

  return (
    <div className="w-full grow px-1 py-2.5">
      <ScrollArea className="lg:h-[calc(100vh-10rem)] px-4">
        {/* Render all secondary categories of the active primary category */}
        {currentCategory?.sub && currentCategory.sub.length > 0 && (
          <div className="space-y-5">
            {renderSecondaryNav(currentCategory.sub, currentCategory.slug)}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
