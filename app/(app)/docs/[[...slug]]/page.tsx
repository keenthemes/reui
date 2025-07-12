import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cn } from '@/registry/default/lib/utils';
import { Badge } from '@/registry/default/ui/badge';
import { allDocs } from 'contentlayer/generated';
import { ExternalLink } from 'lucide-react';
import Balancer from 'react-wrap-balancer';
import { siteConfig } from '@/config/site';
import { resolveCode, resolveComponent } from '@/lib/docs';
import { absoluteUrl } from '@/lib/helpers';
import { getTableOfContents } from '@/lib/toc';
import { Mdx } from '@/components/mdx-components';
import { DocsPager } from '@/components/pager';
import { DashboardTableOfContents } from '@/components/toc';

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = (await params).slug?.join('/') || '';

  // Normalize the slug to remove any folder wrapped in parentheses
  const doc = allDocs.find((doc) => doc.slugAsParams.replace(/\(.*?\)\//g, '') === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: 'article',
      url: absoluteUrl(doc.slug),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: ['https://reui.io/brand/logo-default.png'],
      creator: '@reui_io',
    },
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    console.log('doc not found', params);
    notFound();
  }

  const examples = await resolveComponent(doc.slugAsParams);
  const code = await resolveCode(doc.slugAsParams);
  const toc = await getTableOfContents(doc.body.raw);

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_250px]">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <div className="mb-2.5 flex items-center space-x-1 text-sm leading-none text-muted-foreground">
          <div className="text-primary font-medium">{doc.component ? 'Components' : 'Getting Started'}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn('scroll-m-20 text-3xl font-semibold tracking-tight')}>{doc.title}</h1>
          {doc.description && (
            <p className="text-base text-secondary-foreground/60">
              <span dangerouslySetInnerHTML={{ __html: doc.description }} />
              <Balancer></Balancer>
            </p>
          )}
        </div>
        {doc.links ? (
          <div className="flex items-center space-x-2 pt-3">
            {/* Render documentation links */}
            {doc.links && Array.isArray(doc.links) && (
              <>
                {doc.links.map((link: { label: string; url: string }, index: number) => (
                  <Link key={`doc-link-${index}`} href={link.url} target="_blank" rel="noreferrer">
                    <Badge
                      variant="secondary"
                      appearance="outline"
                      className="inline-flex items-centger py-1 px-1.5 gap-1 hover:text-primary"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </Badge>
                  </Link>
                ))}
              </>
            )}
          </div>
        ) : null}
        <div className="pb-12 pt-8">
          <Mdx code={doc.body.code} componentExamples={examples} componentCode={code} />
        </div>
        <DocsPager doc={doc} />
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-[100px] h-[calc(100vh-3.5rem)]">
          <div className="no-scrollbar h-full overflow-auto pb-20">
            {doc.toc && <DashboardTableOfContents toc={toc} />}
          </div>
        </div>
      </div>
    </main>
  );
}
