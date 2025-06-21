'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { BlockCategory, BlockSubCategory } from '@/config/types';

interface AppLayoutProps {
  children: React.ReactNode;
}

const defaultDescription =
  'Essential set of UI blocks built with React, Tailwind CSS, and Radix UI to ship your next idea faster than ever';

export default function BlocksLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [currentCategory, setCurrentCategory] = useState<BlockCategory | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<BlockSubCategory | null>(null);

  useEffect(() => {
    // Extract category and subcategory slugs from URL (e.g., /blocks/[category]/[subcategory])
    const pathSegments = pathname.split('/').filter(Boolean); // e.g., ["blocks", "navigations", "user-menu"]
    const categorySlug = pathSegments[1]; // e.g., "navigations"
    const subCategorySlug = pathSegments[2]; // e.g., "user-menu"

    if (categorySlug && pathSegments.length > 1) {
      // Find the category in blocksConfig
      const foundCategory = blocksConfig.find((category) => category.slug === categorySlug);
      setCurrentCategory(foundCategory || null);

      // Find the subcategory if present
      if (subCategorySlug && foundCategory?.sub) {
        const foundSubCategory = foundCategory.sub.find((sub) => sub.slug === subCategorySlug);
        setCurrentSubCategory(foundSubCategory || null);
      } else {
        setCurrentSubCategory(null);
      }
    } else {
      setCurrentCategory(null); // Root blocks page
      setCurrentSubCategory(null);
    }
  }, [pathname]);

  // Determine if we're on the root blocks page or a category page
  const isRootPage = pathname === '/blocks';
  const isSubCategoryPage = !!currentSubCategory;

  return (
    <div className="container">
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
    </div>
  );
}
