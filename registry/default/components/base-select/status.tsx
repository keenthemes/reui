import { useState } from 'react';
import {
  Select,
  SelectClear,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/base-select';
import { cn } from '@/lib/utils';

const items = [
  {
    label: 'In Progress',
    value: '1',
    state: 'bg-violet-500',
  },
  {
    label: 'Completed',
    value: '2',
    state: 'bg-green-500',
  },
  {
    label: 'Pending',
    value: '3',
    state: 'bg-primary',
  },
  {
    label: 'Cancelled',
    value: '4',
    state: 'bg-yellow-500',
  },
  {
    label: 'Rejected',
    value: '5',
    state: 'bg-destructive',
  },
];

export default function BaseSelectStatusDemo() {
  const [value, setValue] = useState<string | null>(null);

  const renderValue = (value: string | null) => items.find((item) => item.value === value)?.label ?? 'Select framework';

  return (
    <Select items={items} indicatorPosition="right">
      <SelectTrigger className="w-60">
        <SelectValue>{renderValue}</SelectValue>
        {value && <SelectClear onClick={() => setValue(null)} />}
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <span className="flex items-center gap-2">
              <span className={cn('size-1.5 rounded-full', item.state)}></span>
              <span>{item.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
