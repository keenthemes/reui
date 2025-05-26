import React from 'react';
import Link from 'next/link';
import { blocksConfig } from '@/config/blocks';
import { PreviewBlock } from '@/components/preview/preview-block';

// Define the expected params type
type PageProps = {
  params: Promise<{
    category: string;
    slug?: string[];
  }>;
};

// Make the component async
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params; // Explicitly await params
  const categorySlug = resolvedParams.category;
  const subCategorySlug = resolvedParams.slug?.[0] ?? undefined;

  // Debug logging (note: console.log might not appear in production builds)
  console.log('categorySlug:', categorySlug);
  console.log('subCategorySlug:', subCategorySlug);

  // Find the category in blocksConfig
  const category = blocksConfig.find((cat) => cat.slug === categorySlug);

  if (!category || !category.sub) {
    return <div>Category not found.</div>;
  }

  // If no subcategory is specified (e.g., "/blocks/navigations/"), list all subcategories
  if (!subCategorySlug) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">{category.title}</h1>
        <div className="grid lg:grid-cols-3 gap-4">
          {category.sub.map((sub) => (
            <Link
              key={sub.slug}
              href={`/blocks/${categorySlug}/${sub.slug}`}
              className="block p-4 border border-border rounded-lg hover:bg-accent"
            >
              <h3 className="text-lg font-medium">{sub.title}</h3>
              <p className="text-sm text-muted-foreground">
                {sub.blocks?.length || 0} Blocks
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Find the subcategory
  const subCategory = category.sub.find((sub) => sub.slug === subCategorySlug);

  if (!subCategory || !subCategory.blocks) {
    return <div>No blocks found for this subcategory.</div>;
  }

  return (
    <div className="space-y-8">
      {subCategory.blocks.map((block) => {
        const blockPath = `${categorySlug}/${subCategorySlug}/${block.slug}`;

        console.log('blockPath:', blockPath);

        return <PreviewBlock key={blockPath} path={blockPath} />;
      })}
    </div>
  );
}
