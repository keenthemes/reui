import { notFound } from 'next/navigation';
import { getBlocks, getPrimaryCategory, getSecondaryCategory } from '@/lib/blocks';

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  // Build pathname from segments
  const pathname = '/blocks/' + slug.join('/');

  // Resolve categories based on segments
  const primaryCategory = getPrimaryCategory(pathname);
  const secondaryCategory = getSecondaryCategory(primaryCategory, pathname);

  // Check if this is a specific block route (4 segments: primary/secondary/tertiary/block)
  if (primaryCategory && secondaryCategory && slug.length === 3) {
    const blockSlug = slug[2];

    // Load blocks for the tertiary category
    const blocks = await getBlocks(primaryCategory, secondaryCategory);

    // Find the specific block
    const block = blocks.find((b) => b.slug === blockSlug);

    if (!block) {
      console.log('block not found 1:', blockSlug);
      notFound();
    }

    try {
      // Try to import the actual block file using the relativePath
      const blockModule = await import(`@/registry/default/blocks/${block.path}`);

      // Return the default export (the React component)
      return <blockModule.default />;
    } catch (error) {
      console.error('Failed to import block:', error);
      notFound();
    }
  } else {
    notFound();
  }
}
