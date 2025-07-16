// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { TableOfContents } from '@/lib/toc';

interface TocProps {
  toc: TableOfContents;
}

export function DashboardTableOfContents({ toc }: TocProps) {
  const itemIds = React.useMemo(
    () =>
      toc.items
        ? toc.items
            .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
            .flat()
            .filter(Boolean)
            .map((id) => id?.split('#')[1])
        : [],
    [toc],
  );
  const activeHeading = useActiveItem(itemIds);

  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [toc]); // Runs only on mount

  if (!toc?.items?.length) {
    return null;
  }

  return (
    <div className="space-y-0.5">
      <p className="font-medium text-xs text-muted-foreground">On This Page</p>
      <Tree tree={toc} activeItem={activeHeading} />
    </div>
  );
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` },
    );

    itemIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  tree: TableOfContents;
  level?: number;
  activeItem?: string;
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return tree?.items?.length && level < 3 ? (
    <ul className={cn('m-0 list-none text-sm', { 'pl-4': level !== 1 })}>
      {tree.items.map((item, index) => {
        return (
          item.title && (
            <li key={index} className={cn('mt-0 pt-2')}>
              <a
                href={item.url}
                className={cn(
                  'inline-block no-underline transition-colors hover:text-primary',
                  item.url === `#${activeItem}` ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {item.title}
              </a>
              {item.items?.length ? <Tree tree={item} level={level + 1} activeItem={activeItem} /> : null}
            </li>
          )
        );
      })}
    </ul>
  ) : null;
}
