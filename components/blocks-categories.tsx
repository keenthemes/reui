'use client';

import { blocksConfig } from '@/config/blocks';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getPrimaryCategory } from '@/lib/blocks';
import { usePathname } from 'next/navigation';

export default function BlocksCategories() {
  const pathname = usePathname();
  const activeCategory = getPrimaryCategory(pathname);

  return (
    <div className="grid items-stretch relative">
      <div className="flex items-stretch gap-7.5 overflow-auto">
        {blocksConfig.map((category) => {
          const isActive = activeCategory?.slug === category.slug;
          
          return (
            <Link
              key={category.slug}
              href={`/blocks/${category.slug}`}
              className={cn(
                "relative py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                "hover:text-foreground",
                isActive 
                  ? "text-foreground" 
                  : "text-muted-foreground"
              )}
            >
              {category.title}
              
              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-px bg-muted-foreground"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
