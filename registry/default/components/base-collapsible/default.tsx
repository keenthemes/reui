'use client';

import * as React from 'react';
import { Button } from '@/registry/default/ui/base-button';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '@/registry/default/ui/base-collapsible';

export default function Component() {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="w-[500px] text-foreground text-sm rounded-lg border border-border p-4">
      ReUI is a free toolkit offering complete CRUD (Create, Read, Update, Delete) examples for real-world projects use
      cases.
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsiblePanel>
          Unlike libraries that address specific parts of CRUD, ReUI delivers end-to-end solutions, making it an
          essential tool for building the core functionality of any application.
        </CollapsiblePanel>

        <div className="text-end">
          <CollapsibleTrigger asChild>
            <Button underlined="dashed" mode="link" size="sm">
              {isOpen ? 'Show less' : 'Show more'}
            </Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
}
