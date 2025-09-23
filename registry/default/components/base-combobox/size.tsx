'use client';

import * as React from 'react';
import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxValue,
} from '@/registry/default/ui/base-combobox';
import { Label } from '@/registry/default/ui/base-label';

export default function ComboboxSizeDemo() {
  const id = React.useId();

  return (
    <div className="w-full max-w-xs space-y-6">
      {/* Small Size */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-small`}>Small</Label>
        <Combobox items={fruits}>
          <ComboboxControl>
            <ComboboxValue>
              <ComboboxInput variant="sm" placeholder="e.g. Apple" id={`${id}-small`} />
            </ComboboxValue>
            <ComboboxClear />
            <ComboboxIcon />
          </ComboboxControl>

          <ComboboxContent>
            <ComboboxEmpty>No fruits found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  <ComboboxItemIndicator />
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {/* Medium Size (Default) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-medium`}>Medium(Default)</Label>
        <Combobox items={fruits}>
          <ComboboxControl>
            <ComboboxValue>
              <ComboboxInput placeholder="e.g. Apple" id={`${id}-medium`} />
            </ComboboxValue>
            <ComboboxClear />
            <ComboboxIcon />
          </ComboboxControl>

          <ComboboxContent>
            <ComboboxEmpty>No fruits found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  <ComboboxItemIndicator />
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {/* Large Size */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-large`}>Large</Label>
        <Combobox items={fruits}>
          <ComboboxControl>
            <ComboboxValue>
              <ComboboxInput variant="lg" placeholder="e.g. Apple" id={`${id}-large`} />
            </ComboboxValue>
            <ComboboxClear />
            <ComboboxIcon />
          </ComboboxControl>

          <ComboboxContent>
            <ComboboxEmpty>No fruits found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  <ComboboxItemIndicator />
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
}

const fruits = [
  'Apple',
  'Banana',
  'Orange',
  'Pineapple',
  'Grape',
  'Mango',
  'Strawberry',
  'Blueberry',
  'Raspberry',
  'Blackberry',
  'Cherry',
  'Peach',
  'Pear',
  'Plum',
  'Kiwi',
  'Watermelon',
  'Cantaloupe',
  'Honeydew',
  'Papaya',
  'Guava',
  'Lychee',
  'Pomegranate',
  'Apricot',
  'Grapefruit',
  'Passionfruit',
];
