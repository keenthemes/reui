import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/registry/default/ui/breadcrumb';
import { BlocksNavToggle } from '@/components/blocks-nav-toggle';
import { BreadcrumbPage } from '@/registry/default/ui/base-breadcrumb';
import { BlockPreview } from '@/components/block-preview';
import { getBlocks, getPrimaryCategory, getSecondaryCategory, getTertiaryCategory } from '@/lib/blocks';
import { BlocksNavMobileToggle } from '@/components/blocks-nav-mobile-toggle';

interface PageProps {
  params: Promise<{ slug?: string[] }>; 
}

export default async function Page({ params }: PageProps) {   
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const pathname = `/blocks/${slug.join('/')}`;

  const primaryCategory = getPrimaryCategory(pathname);
  const secondaryCategory = getSecondaryCategory(primaryCategory, pathname);
  const tertiaryCategory = getTertiaryCategory(secondaryCategory, pathname);
  const blocks = await getBlocks(primaryCategory, secondaryCategory, tertiaryCategory);  

  return (
    <div className="container-fixed space-y-4 px-0 lg:px-6 transition-all duration-300">
      <div className="flex items-center gap-1.5 min-h-8">
        <BlocksNavMobileToggle />
        <BlocksNavToggle />     
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/blocks">Blocks</BreadcrumbLink>
            </BreadcrumbItem>
            {primaryCategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/blocks/${primaryCategory.slug}`}>{primaryCategory.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            {secondaryCategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbPage>
                  <BreadcrumbLink asChild>
                    <Link href={`/blocks/${primaryCategory?.slug}/${secondaryCategory.slug}`}>{secondaryCategory.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbPage>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
                  
      <div className="flex flex-col gap-1.5 mb-7.5">
        <h1 className="text-2xl font-bold m-0">{tertiaryCategory?.title}</h1>
        <p className="text-base text-muted-foreground max-w-xl">
          {tertiaryCategory?.description}
        </p>
      </div>
      
      <div className="space-y-8">
        {blocks && blocks.length > 0 ? (
          blocks.map((block, index) => (
            <BlockPreview key={block.slug || index} block={block} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No blocks found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
