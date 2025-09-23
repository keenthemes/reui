'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/registry/default/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/default/ui/collapsible';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/registry/default/ui/hover-card';
import { LoaderCircleIcon, Minus, Plus } from 'lucide-react';
import { componentsConfig } from '@/config/components';
import { getSlug } from '@/lib/helpers';
import SiteHero from '@/components/site-hero';

export default function Page() {
  const components = componentsConfig.sidebarNav[1];

  const highlightedComponents =
    components.items
      ?.filter((component) => component.highlight !== undefined)
      .sort((a, b) => {
        const aHighlight = a.highlight!;
        const bHighlight = b.highlight!;
        const aHasOrder = aHighlight.order !== undefined;
        const bHasOrder = bHighlight.order !== undefined;

        if (aHasOrder && bHasOrder) {
          return aHighlight.order! - bHighlight.order!;
        }
        if (aHasOrder) return -1;
        if (bHasOrder) return 1;
        return 0;
      })
      .filter((component) => component.highlight!.examples?.length > 0) || [];

  // State to track the currently open collapsible (null if none)
  const [openComponent, setOpenComponent] = React.useState<string | null>(null);

  // Handler to toggle a specific collapsible
  const handleOpenChange = (title: string) => (isOpen: boolean) => {
    setOpenComponent(isOpen ? title : null);
  };

  return (
    <div className="container">
      <SiteHero />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7.5">
        {highlightedComponents.map((component) => {
          const isOpen = openComponent === component.title;
          return (
            <div key={component.title} className="space-y-5 mb-2.5">
              <Collapsible open={isOpen} onOpenChange={handleOpenChange(component.title)}>
                <div className="space-y-3.5">
                  <div className="relative overflow-hidden border border-border bg-muted/60 rounded-xl min-h-[185px]">
                    <Link href={`/docs/${getSlug(component.title)}`} className="block">
                      <Image
                        src={`/screens/components/thumbnails/${getSlug(component.title)}-light.png`}
                        className="w-auto dark:hidden"
                        height={185}
                        width={500}
                        alt=""
                      />
                      <Image
                        src={`/screens/components/thumbnails/${getSlug(component.title)}-dark.png`}
                        className="w-auto hidden dark:block"
                        height={185}
                        width={500}
                        alt=""
                      />
                    </Link>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        mode="icon"
                        size="sm"
                        className="cursor-pointer absolute bottom-3 end-3 h-7 w-7"
                      >
                        {isOpen ? <Minus /> : <Plus />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <div>
                    <CollapsibleContent>
                      {component.highlight!.examples && (
                        <div className="flex flex-wrap gap-2 border-b border-border mb-2 pt-1 pb-3.5">
                          {component.highlight!.examples.map((example) => (
                            <HoverCard key={example} openDelay={300} closeDelay={0}>
                              <HoverCardTrigger asChild>
                                <Button variant="outline" shape="circle" size="sm" className="cursor-pointer" asChild>
                                  <Link
                                    href={`/docs/${getSlug(component.title)}#${getSlug(example)}`}
                                    target="_blank"
                                    className="block cursor-pointer"
                                  >
                                    {example}
                                  </Link>
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent side="top" align="start" className="relative w-auto p-4">
                                <div className="absolute top-1/2 start-1/2 -translate-y-1/2 -translate-x-1/2">
                                  <LoaderCircleIcon className="animate-spin size-4 text-muted-foreground" />
                                </div>
                                <Link
                                  href={`/docs/${getSlug(component.title)}#${getSlug(example)}`}
                                  target="_blank"
                                  className="relative block cursor-pointer"
                                >
                                  <img
                                    src={`/screens/components/examples/${getSlug(component.title)}/${getSlug(example)}-light.png`}
                                    className="w-auto dark:hidden"
                                    alt=""
                                  />
                                  <img
                                    src={`/screens/components/examples/${getSlug(component.title)}/${getSlug(example)}-dark.png`}
                                    className="w-auto hidden dark:block"
                                    alt=""
                                  />
                                </Link>
                              </HoverCardContent>
                            </HoverCard>
                          ))}
                        </div>
                      )}
                    </CollapsibleContent>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/docs/${getSlug(component.title)}`}
                        className="text-sm text-foreground font-medium hover:underline hover:underline-offset-2"
                      >
                        {component.title}
                      </Link>
                      <span className="text-[13px] text-muted-foreground font-normal">
                        {component.highlight!.examples?.length || 0} Examples
                      </span>
                    </div>
                  </div>
                </div>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
}
