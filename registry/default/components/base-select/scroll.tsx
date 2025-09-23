import { useState } from 'react';
import {
  Select,
  SelectClear,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/base-select';

export default function SelectScroll() {
  const [value, setValue] = useState<string | null>(null);

  const items = [
    { label: 'Tokyo', value: 'tokyo' },
    { label: 'New York', value: 'new_york' },
    { label: 'London', value: 'london' },
    { label: 'Paris', value: 'paris' },
    { label: 'Berlin', value: 'berlin' },
    { label: 'Madrid', value: 'madrid' },
    { label: 'Rome', value: 'rome' },
    { label: 'Barcelona', value: 'barcelona' },
    { label: 'Amsterdam', value: 'amsterdam' },
    { label: 'Brussels', value: 'brussels' },
    { label: 'Copenhagen', value: 'copenhagen' },
    { label: 'Dublin', value: 'dublin' },
    { label: 'Helsinki', value: 'helsinki' },
    { label: 'Zurich', value: 'zurich' },
    { label: 'Vienna', value: 'vienna' },
    { label: 'Budapest', value: 'budapest' },
    { label: 'Prague', value: 'prague' },
    { label: 'Lisbon', value: 'lisbon' },
    { label: 'Athens', value: 'athens' },
    { label: 'Oslo', value: 'oslo' },
    { label: 'Stockholm', value: 'stockholm' },
    { label: 'Warsaw', value: 'warsaw' },
    { label: 'Moscow', value: 'moscow' },
    { label: 'Istanbul', value: 'istanbul' },
    { label: 'Dubai', value: 'dubai' },
    { label: 'Singapore', value: 'singapore' },
    { label: 'Hong Kong', value: 'hong_kong' },
    { label: 'Sydney', value: 'sydney' },
    { label: 'Melbourne', value: 'melbourne' },
    { label: 'Auckland', value: 'auckland' },
  ];

  return (
    <Select value={value} onValueChange={(value) => setValue(value as string | null)}>
      <SelectTrigger className="w-60">
        <SelectValue>{value ? items.find((item) => item.value === value)?.label : 'Select a city'}</SelectValue>
        {value && <SelectClear onClick={() => setValue(null)} />}
      </SelectTrigger>
      <SelectContent className="max-h-56">
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
