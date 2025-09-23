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

export default function ComboboxDemo() {
  const id = React.useId();

  return (
    <div className="max-w-xs w-full">
      <Combobox items={fruits}>
        <div className="flex flex-col gap-2">
          <Label htmlFor={id}>Choose a fruit</Label>
          <ComboboxControl>
            <ComboboxValue>
              <ComboboxInput placeholder="e.g. Apple" id={id} />
            </ComboboxValue>
            <ComboboxClear />
            <ComboboxIcon />
          </ComboboxControl>
        </div>

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
