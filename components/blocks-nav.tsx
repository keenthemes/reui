'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSeparator,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from '@/registry/default/ui/accordion-menu';
import {
  Box,
  Calendar,
  ChevronRight,
  FileText,
  Folder,
  Grid,
  Layout,
  Package,
  ShoppingCart,
  UserPlus,
} from 'lucide-react';
import { blocksConfig } from '@/config/blocks';
import { BlockCategory, BlockSubCategory, BlockItem } from '@/config/types';

// Icon mapping for different block categories
const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'application-ui':
      return Layout;
    case 'marketing':
      return Grid;
    case 'onboarding':
      return UserPlus;
    case 'e-commerce':
      return ShoppingCart;
    default:
      return Folder;
  }
};

// Icon mapping for subcategories
const getSubCategoryIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('header')) return Box;
  if (lowerTitle.includes('form')) return FileText;
  if (lowerTitle.includes('card')) return Package;
  if (lowerTitle.includes('navigation')) return Calendar;
  return ChevronRight;
};

export default function BlocksNav() {
  const pathname = usePathname();

  const matchPath = (path: string) => 
    path === pathname || (path.length > 1 && pathname.startsWith(path));

  // Helper function to render block items
  const renderBlockItems = (blocks: BlockItem[], parentSlug: string) => {
    return blocks.map((block) => {
      const blockPath = `/blocks/${parentSlug}/${block.id}`;
      return (
        <AccordionMenuItem key={block.id} value={blockPath}>
          <Link href={blockPath}>
            <FileText />
            <span>{block.title || `Block ${block.id}`}</span>
            {block.new && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">New</span>}
          </Link>
        </AccordionMenuItem>
      );
    });
  };

  // Helper function to render subcategories recursively
  const renderSubCategories = (subCategories: BlockSubCategory[], parentSlug: string, level: number = 0) => {
    return subCategories.map((subCategory, index) => {
      const subCategorySlug = `${parentSlug}/${subCategory.slug || index}`;
      const IconComponent = getSubCategoryIcon(subCategory.title);

      // If this subcategory has blocks, render them
      if (subCategory.blocks && subCategory.blocks.length > 0) {
        return (
          <AccordionMenuSub key={subCategory.slug || index} value={subCategorySlug}>
            <AccordionMenuSubTrigger>
              <IconComponent />
              <span>{subCategory.title}</span>
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent type="single" collapsible parentValue={subCategorySlug}>
              <AccordionMenuGroup>
                {renderBlockItems(subCategory.blocks, subCategorySlug)}
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>
        );
      }

      // If this subcategory has nested subcategories
      if (subCategory.sub && subCategory.sub.length > 0) {
        return (
          <AccordionMenuSub key={subCategory.slug || index} value={subCategorySlug}>
            <AccordionMenuSubTrigger>
              <IconComponent />
              <span>{subCategory.title}</span>
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent type="single" collapsible parentValue={subCategorySlug}>
              <AccordionMenuGroup>
                {renderSubCategories(subCategory.sub, subCategorySlug, level + 1)}
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>
        );
      }

      // Simple menu item if no children
      const itemPath = `/blocks/${subCategorySlug}`;
      return (
        <AccordionMenuItem key={subCategory.slug || index} value={itemPath}>
          <Link href={itemPath}>
            <IconComponent />
            <span>{subCategory.title}</span>
          </Link>
        </AccordionMenuItem>
      );
    });
  };

  // Helper function to render main categories
  const renderCategories = (categories: BlockCategory[]) => {
    return categories.map((category) => {
      const CategoryIcon = getCategoryIcon(category.slug);
      
      if (!category.sub || category.sub.length === 0) {
        // Simple category without subcategories
        const categoryPath = `/blocks/${category.slug}`;
        return (
          <AccordionMenuItem key={category.slug} value={categoryPath}>
            <Link href={categoryPath}>
              <CategoryIcon />
              <span>{category.title}</span>
            </Link>
          </AccordionMenuItem>
        );
      }

      // Category with subcategories
      return (
        <AccordionMenuSub key={category.slug} value={category.slug}>
          <AccordionMenuSubTrigger>
            <CategoryIcon />
            <span>{category.title}</span>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent type="single" collapsible parentValue={category.slug}>
            <AccordionMenuGroup>
              {renderSubCategories(category.sub, category.slug)}
            </AccordionMenuGroup>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      );
    });
  };

  return (
    <div className="w-full md:w-[250px] overflow-hidden border border-border rounded-md p-2">
      <AccordionMenu
        selectedValue={pathname}
        matchPath={matchPath}
        type="single"
        collapsible
        classNames={{ separator: '-mx-2 mb-2.5' }}
      >
        <AccordionMenuLabel>Blocks</AccordionMenuLabel>
        <AccordionMenuSeparator />

        <AccordionMenuGroup>
          {renderCategories(blocksConfig)}
        </AccordionMenuGroup>
      </AccordionMenu>
    </div>
  );
}
