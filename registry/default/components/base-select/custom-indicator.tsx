import { useState } from 'react';
import {
  Select,
  SelectClear,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/base-select';
import { RiCheckboxCircleFill } from '@remixicon/react';

const items = [
  {
    label: 'Full access',
    description: 'Can modify list access',
    value: 'full_access',
  },
  {
    label: 'Read and write',
    description: 'Can edit & publish lists',
    value: 'read_write',
  },
  {
    label: 'Read only',
    description: 'Can only view lists',
    value: 'read_only',
  },
  {
    label: 'No access',
    description: 'Cannot view or edit lists',
    value: 'no_access',
  },
];

export default function BaseSelectDemo() {
  const [value, setValue] = useState<string | null>(null);

  const renderValue = (value: string | null) =>
    items.find((item) => item.value === value)?.label ?? 'Select access level';

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(value) => setValue(value as string | null)}
      indicatorPosition="right"
      indicator={
        <SelectIndicator>
          <RiCheckboxCircleFill className="size-4 text-primary" />
        </SelectIndicator>
      }
    >
      <SelectTrigger className="w-60">
        <SelectValue>{renderValue}</SelectValue>
        {value && <SelectClear onClick={() => setValue(null)} />}
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <span className="flex flex-col items-start gap-px">
              <span className="font-medium">{item.label}</span>
              <small className="text-muted-foreground text-xs">{item.description}</small>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
