'use client';

import * as React from 'react';
import {
  Combobox,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxValue,
} from '@/registry/default/ui/base-combobox';
import { Label } from '@/registry/default/ui/base-label';

export default function ComboboxGroups() {
  const id = React.useId();

  return (
    <div className="max-w-xs w-full">
      <Combobox items={foodOptions}>
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

        <ComboboxContent className="pt-0">
          <ComboboxEmpty className="not-empty:pt-3">No results found.</ComboboxEmpty>
          <ComboboxList>
            {(group: Group) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxGroupLabel className="sticky top-0 z-10 bg-background ps-7 pe-0 py-2 text-xs font-medium uppercase text-muted-foreground">
                  {group.value}
                </ComboboxGroupLabel>

                <ComboboxCollection>
                  {(item: Item) => (
                    <ComboboxItem key={item.value} value={item}>
                      <ComboboxItemIndicator />
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

interface Group {
  value: string;
  items: Item[];
}

interface Item {
  value: string;
  label: string;
}

const foodOptions: Group[] = [
  {
    value: 'Fruits',
    items: [
      { value: 'apple', label: 'Apple' },
      { value: 'orange', label: 'Orange' },
      { value: 'banana', label: 'Banana' },
      { value: 'grape', label: 'Grape' },
      { value: 'mango', label: 'Mango' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'pineapple', label: 'Pineapple' },
      { value: 'watermelon', label: 'Watermelon' },
    ],
  },
  {
    value: 'Vegetables',
    items: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
      { value: 'spinach', label: 'Spinach' },
      { value: 'potato', label: 'Potato' },
      { value: 'tomato', label: 'Tomato' },
      { value: 'onion', label: 'Onion' },
      { value: 'cucumber', label: 'Cucumber' },
      { value: 'pepper', label: 'Bell Pepper' },
    ],
  },
  {
    value: 'Dairy',
    items: [
      { value: 'milk', label: 'Milk' },
      { value: 'cheese', label: 'Cheese' },
      { value: 'yogurt', label: 'Yogurt' },
      { value: 'butter', label: 'Butter' },
      { value: 'cream', label: 'Cream' },
      { value: 'ghee', label: 'Ghee' },
      { value: 'paneer', label: 'Paneer' },
      { value: 'ice-cream', label: 'Ice Cream' },
    ],
  },
];
