'use client';

import { useId, useState } from 'react';
import { Label } from '@/registry/default/ui/label';
import { Tag, TagInput } from 'emblor';

const tags = [
  {
    id: '1',
    text: 'Red',
  },
];

export default function Component() {
  const id = useId();
  const [exampleTags, setExampleTags] = useState<Tag[]>(tags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Input external tags</Label>
      <TagInput
        id={id}
        tags={exampleTags}
        setTags={(newTags) => {
          setExampleTags(newTags);
        }}
        placeholder="Add a tag"
        styleClasses={{
          inlineTagsContainer:
            'border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/30 p-1 gap-1',
          input: 'w-full shadow-none px-2 min-h-6 ',
          tag: {
            body: 'h-6 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7',
            closeButton:
              'absolute -inset-y-px -end-px p-0 rounded-e-md flex size-6 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground',
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
      />
    </div>
  );
}
