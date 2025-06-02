import Link from 'next/link';
import { Doc } from 'contentlayer/generated';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { docsConfig } from '@/config/docs';
import { NavItem, NavItemWithChildren } from '@/config/types';

interface DocsPagerProps {
  doc: Doc;
}

export function DocsPager({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc);

  if (!pager) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href ? (
        <Link href={pager.prev.href} className="inline-flex items-end flex-col gap-0.5 hover:text-blue-600 group">
          <span className="text-muted-foreground text-xs">Previouse</span>
          <span className="inline-flex items-center gap-0.5">
            <ChevronLeft className="size-3.5 text-muted-foreground -ms-1 group-hover:text-blue-600" />
            {pager.prev.title}
          </span>
        </Link>
      ) : (
        <div></div>
      )}
      {pager?.next?.href ? (
        <Link href={pager.next.href} className="inline-flex flex-col gap-0.5 hover:text-blue-600 group">
          <span className="text-muted-foreground text-xs">Next</span>
          <span className="inline-flex items-center gap-0.5">
            {pager.next.title}
            <ChevronRight className="size-3.5 text-muted-foreground -me-1 group-hover:text-blue-600" />
          </span>
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export function getPagerForDoc(doc: Doc) {
  const nav = docsConfig.sidebarNav;
  const flattenedLinks = [null, ...flatten(nav), null];
  const activeIndex = flattenedLinks.findIndex((link) => doc.slug === link?.href);
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null;
  const next = activeIndex !== flattenedLinks.length - 1 ? flattenedLinks[activeIndex + 1] : null;
  return {
    prev,
    next,
  };
}

export function flatten(links: NavItemWithChildren[]): NavItem[] {
  return links
    .reduce<NavItem[]>((flat, link) => {
      return flat.concat(link.items?.length ? flatten(link.items) : link);
    }, [])
    .filter((link) => !link?.disabled);
}
