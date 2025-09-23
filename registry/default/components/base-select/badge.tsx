import { useState } from 'react';
import { Badge } from '@/registry/default/ui/badge';
import {
  Select,
  SelectClear,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/base-select';
import { VariantProps } from 'class-variance-authority';
import { badgeVariants } from '../../ui/base-badge';

type Item = {
  label: string;
  state: VariantProps<typeof badgeVariants>['variant'];
  value: string | null;
};

const items: Item[] = [
  {
    label: 'In Progress',
    state: 'primary',
    value: '1',
  },
  {
    label: 'Completed',
    value: '2',
    state: 'success',
  },
  {
    label: 'Pending',
    value: '3',
    state: 'info',
  },
  {
    label: 'Cancelled',
    value: '4',
    state: 'destructive',
  },
  {
    label: 'Rejected',
    value: '5',
    state: 'warning',
  },
];

export default function BaseSelectDemo() {
  const [value, setValue] = useState<string | null>(null);
  const selectedItem = items.find((item) => item.value === value) || null;

  const renderValue = (item: Item | null) => {
    return item ? (
      <Badge variant={item.state} size="sm" appearance="outline">
        {item.label}
      </Badge>
    ) : (
      <span>Select a status</span>
    );
  };
  return (
    <Select value={value} onValueChange={(value) => setValue(value as string | null)} indicatorPosition="right">
      <SelectTrigger className="w-60">
        <SelectValue>{renderValue(selectedItem)}</SelectValue>
        {value && <SelectClear onClick={() => setValue(null)} />}
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <Badge variant={item.state} size="sm" appearance="outline">
              {item.label}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
