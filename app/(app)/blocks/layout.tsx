'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Badge } from '@/registry/default/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/registry/default/ui/breadcrumb';
import { blocksConfig } from '@/config/blocks';
import { BlockCategory, BlockSubCategory, BlockItem } from '@/config/types';
import BlocksNav from '@/components/blocks-nav';

interface AppLayoutProps {
  children: React.ReactNode;
}

const defaultDescription =
  'Essential set of UI blocks built with React, Tailwind CSS, and Radix UI to ship your next idea faster than ever';

// Helper function to find the first subcategory with blocks recursively
function findFirstSubCategoryWithBlocks(categories: BlockCategory[]): BlockSubCategory | null {
  for (const category of categories) {
    if (category.sub) {
      for (const subCategory of category.sub) {
        // Check if this subcategory has blocks
        if (subCategory.blocks && subCategory.blocks.length > 0) {
          return subCategory;
        }
        // Check nested subcategories
        if (subCategory.sub) {
          const found = findFirstSubCategoryWithBlocks([{ ...category, sub: subCategory.sub }]);
          if (found) return found;
        }
      }
    }
  }
  return null;
}

// Helper function to find blocks in the current path
function findBlocksForPath(pathname: string): { 
  category: BlockCategory | null, 
  subCategory: BlockSubCategory | null, 
  blocks: BlockItem[] 
} {
  const pathSegments = pathname.split('/').filter(Boolean);
  const categorySlug = pathSegments[1];
  const subCategorySlug = pathSegments[2];

  // Find category
  const category = blocksConfig.find((cat) => cat.slug === categorySlug) || null;
  
  if (!category || !category.sub) {
    return { category, subCategory: null, blocks: [] };
  }

  // Find subcategory
  let subCategory: BlockSubCategory | null = null;
  let blocks: BlockItem[] = [];

  if (subCategorySlug) {
    // Look for specific subcategory
    const findSubCategory = (subs: BlockSubCategory[], targetSlug: string): BlockSubCategory | null => {
      for (const sub of subs) {
        if (sub.slug === targetSlug) {
          return sub;
        }
        if (sub.sub) {
          const found = findSubCategory(sub.sub, targetSlug);
          if (found) return found;
        }
      }
      return null;
    };

    subCategory = findSubCategory(category.sub, subCategorySlug);
    blocks = subCategory?.blocks || [];
  }

  return { category, subCategory, blocks };
}

export default function BlocksLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState<BlockCategory | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<BlockSubCategory | null>(null);
  const [currentBlocks, setCurrentBlocks] = useState<BlockItem[]>([]);

  useEffect(() => {
    const { category, subCategory, blocks } = findBlocksForPath(pathname);
    
    setCurrentCategory(category);
    setCurrentSubCategory(subCategory);
    setCurrentBlocks(blocks);

    // If we're on the root blocks page, redirect to the first subcategory with blocks
    if (pathname === '/blocks') {
      const firstSubCategory = findFirstSubCategoryWithBlocks(blocksConfig);
      if (firstSubCategory && category) {
        router.push(`/blocks/${category.slug}/${firstSubCategory.slug}`);
      }
    }
  }, [pathname, router]);

  // Determine page type
  const isRootPage = pathname === '/blocks';
  const isSubCategoryPage = !!currentSubCategory;

  return (
    <div className="container-fluid">
      {/* Main content with sidebar layout */}
      <div className="flex gap-8 pb-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          <BlocksNav />
        </div>

        {/* Main content area */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-center py-8 lg:py-20 gap-6">
            <div className="flex items-center flex-col justify-between gap-6">
              <div>
                {isRootPage ? (
                  <Badge className="bg-muted px-2.5 py-1.5" size="lg" shape="circle" appearance="outline">
                    Blocks
                  </Badge>
                ) : (
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href="/blocks">Blocks</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{currentCategory?.title || 'Category Not Found'}</BreadcrumbPage>
                      </BreadcrumbItem>
                      {isSubCategoryPage && (
                        <>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            <BreadcrumbPage>{currentSubCategory?.title || 'Subcategory Not Found'}</BreadcrumbPage>
                          </BreadcrumbItem>
                        </>
                      )}
                    </BreadcrumbList>
                  </Breadcrumb>
                )}
              </div>

              {/* Conditionally render title based on whether it's root, category, or subcategory page */}
              <h1 className="text-2xl lg:text-[48px] font-bold">
                {isRootPage
                  ? 'UI blocks'
                  : isSubCategoryPage
                    ? currentSubCategory?.title || 'Subcategory Not Found'
                    : currentCategory?.title || 'Category Not Found'}
              </h1>

              {/* Conditionally render description */}
              <div className="text-center text-lg lg:max-w-[550px]">
                {isRootPage
                  ? defaultDescription
                  : isSubCategoryPage
                    ? currentSubCategory?.description ||
                      currentCategory?.description ||
                      'No description available for this subcategory.'
                    : currentCategory?.description || 'No description available for this category.'}
              </div>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
