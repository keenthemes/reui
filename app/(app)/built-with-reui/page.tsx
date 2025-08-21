'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { templates } from '@/config/templates';
import { Icons } from '@/components/icons';
import { SiteHeroTemplates } from '@/components/site-hero-templates';

export default function Page() {
  return (
    <div className="container">
      <SiteHeroTemplates />

      <div>
        {templates.map((template) => (
          <div
            key={template.title}
            className="flex flex-col lg:flex-row lg:items-center gap-6 xl:gap-12 2xl:gap-20 border-t border-border/60 py-15"
          >
            {/* Left: Info */}
            <div className="order-2 lg:order-1 w-full md:w-[500px] shrink-0 space-y-6">
              <div className="flex items-center gap-3.5">
                <h2 className="text-2xl font-bold m-0">{template.title}</h2>
                {template.new && (
                  <Badge variant="warning" appearance="light">
                    New
                  </Badge>
                )}
                {template.price && (
                  <Badge variant="info" appearance="light">
                    Premium
                  </Badge>
                )}
                {template.free && (
                  <Badge variant="success" appearance="light">
                    Free
                  </Badge>
                )}
              </div>
              <div className="text-base text-muted-foreground">{template.description}</div>
              <div className="flex items-center gap-3.5 mb-7.5">
                <Button asChild variant="mono" size="lg">
                  <Link href={template.purchaseUrl || template.previewUrl} target="_blank" rel="noopener noreferrer">
                    Purchase on {template.market} - {template.price}
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={template.previewUrl} target="_blank" rel="noopener noreferrer">
                    Live Preview
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-5">
                {template.stack?.map((iconName: keyof typeof Icons, i: number) => {
                  const Icon = Icons[iconName];
                  const tooltip = iconName.charAt(0).toUpperCase() + iconName.slice(1);

                  return Icon ? (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <Icon className="size-5.5" />
                      </TooltipTrigger>
                      <TooltipContent>{tooltip}</TooltipContent>
                    </Tooltip>
                  ) : null;
                })}
              </div>
            </div>

            {/* Right: Images */}
            <div className="order-1 lg:order-2 flex grow items-center justify-center w-full overflow-hidden border shadow-md rounded-xl">
              <Link href={template.previewUrl} target="_blank">
                <img
                  src={'/templates/' + template.thumbnail}
                  alt={template.title}
                  className="object-cover w-full lg:-mb-[100px]"
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
