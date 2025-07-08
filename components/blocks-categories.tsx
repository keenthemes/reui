'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { blocksConfig } from '@/config/blocks';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getPrimaryCategory } from '@/lib/blocks';
import { usePathname } from 'next/navigation';

export default function BlocksCategories() {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const activeCategory = getPrimaryCategory(pathname);

  return (
    <div className="flex items-stretch relative">
      <div className="flex items-stretch gap-7.5">
        {blocksConfig.map((category) => {
          const isActive = activeCategory?.slug === category.slug;
          const isHovered = hoveredTab === category.slug;
          
          return (
            <Link
              key={category.slug}
              href={`/blocks/${category.slug}`}
              className={cn(
                "relative py-4 text-sm font-medium transition-colors duration-200",
                "hover:text-foreground",
                isActive 
                  ? "text-foreground" 
                  : "text-muted-foreground"
              )}
              onMouseEnter={() => setHoveredTab(category.slug)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {category.title}
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-muted-foreground"
                  layoutId="activeTab"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
              
              {/* Hover indicator */}
              {isHovered && !isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-muted-foreground"
                  layoutId="hoverTab"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
