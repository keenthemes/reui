'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/registry/default/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/registry/default/ui/collapsible';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card';
import { Minus, Plus } from 'lucide-react';
import { blocksConfig } from '@/config/blocks';
import { BlockCategory, BlockItem, BlockSubCategory } from '@/config/types';

export default function Page() {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const handleOpenChange = (title: string) => (isOpen: boolean) => {
    setOpenStates((prev) => ({ ...prev, [title]: isOpen }));
  };

  return (
    <>
      {blocksConfig.map((category: BlockCategory) => (
        <div key={category.slug} className="space-y-5 mb-10">
          <h1 className="text-lg font-semibold text-foreground">
            {category.title}
          </h1>
          {category.sub && category.sub.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-7.5">
              {category.sub.map((component: BlockSubCategory) => (
                <div key={component.slug} className="">
                  <Collapsible
                    open={openStates[component.title]}
                    onOpenChange={handleOpenChange(component.title)}
                  >
                    <div className="space-y-3">
                      <div className="relative border border-border bg-muted/60 rounded-xl">
                        <Link
                          href={`/blocks/${category.slug}/${component.slug}`}
                          className="h-[225px] block"
                        ></Link>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="outline"
                            mode="icon"
                            size="sm"
                            className="absolute bottom-3 end-3"
                          >
                            {openStates[component.title] ? <Minus /> : <Plus />}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/blocks/${category.slug}/${component.slug}`}
                            className="text-sm text-foreground font-medium hover:underline hover:underline-offset-2"
                          >
                            {component.title}
                          </Link>
                          <span className="text-xs text-muted-foreground font-normal">
                            {component.blocks?.length || 0} Blocks
                          </span>
                        </div>
                        <CollapsibleContent>
                          {component.blocks && (
                            <div className="flex flex-wrap gap-2.5 mt-2">
                              {component.blocks.map((block: BlockItem) => (
                                <HoverCard key={block.slug} openDelay={100}>
                                  <HoverCardTrigger asChild>
                                    <Button
                                      variant="outline"
                                      shape="circle"
                                      size="sm"
                                    >
                                      {block.title}
                                    </Button>
                                  </HoverCardTrigger>
                                  <HoverCardContent
                                    side="bottom"
                                    align="start"
                                    className="w-80"
                                  >
                                    Wow!!!!
                                  </HoverCardContent>
                                </HoverCard>
                              ))}
                            </div>
                          )}
                        </CollapsibleContent>
                      </div>
                    </div>
                  </Collapsible>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
    </>
  );
}
