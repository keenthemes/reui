'use client';

import * as React from 'react';
import { Button } from '@/registry/default/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/default/ui/collapsible';

export default function CollapsibleDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-[500px] text-foreground text-sm rounded-lg border border-border p-4">
      Crudhunt is a free toolkit offering complete CRUD (Create, Read, Update, Delete) examples for real-world projects
      use cases.
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          Unlike libraries that address specific parts of CRUD, Crudhunt delivers end-to-end solutions, making it an
          essential tool for building the core functionality of any application.
        </CollapsibleContent>

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
