import { useState } from 'react';
import {
  Select,
  SelectClear,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/base-select';

export default function SelectClearDemo() {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const items = [
    {
      label: 'Apple',
      value: 'apple',
    },
    {
      label: 'Banana',
      value: 'banana',
    },
    {
      label: 'Cherry',
      value: 'cherry',
    },
    {
      label: 'Orange',
      value: 'orange',
    },
    {
      label: 'Grape',
      value: 'grape',
    },
  ];

  const handleClear = () => {
    setSelectedValue(null);
  };

  const handleValueChange = (value: unknown) => {
    setSelectedValue(value as string | null);
  };

  const renderValue = (value: string | null) =>
    items.find((item) => item.value === value)?.label ?? 'Select a fruit...';

  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-60">
        <SelectValue>{renderValue}</SelectValue>
        {selectedValue && <SelectClear onClick={handleClear} />}
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
