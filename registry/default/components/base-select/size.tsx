import { useState } from 'react';
import {
  Select,
  SelectClear,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/base-select';

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

export default function BaseSelectSizeDemo() {
  const [smValue, setSmValue] = useState<string | null>(null);
  const [mdValue, setMdValue] = useState<string | null>(null);
  const [lgValue, setLgValue] = useState<string | null>(null);

  const renderSmValue = (value: string | null) => items.find((item) => item.value === value)?.label ?? 'Small';

  const renderMdValue = (value: string | null) => items.find((item) => item.value === value)?.label ?? 'Medium';

  const renderLgValue = (value: string | null) => items.find((item) => item.value === value)?.label ?? 'Large';

  return (
    <div className="flex flex-col gap-6">
      <Select value={smValue} onValueChange={(value) => setSmValue(value as string | null)}>
        <SelectTrigger size="sm" className="w-60">
          <SelectValue>{renderSmValue}</SelectValue>
          {smValue && <SelectClear onClick={() => setSmValue(null)} />}
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={mdValue} onValueChange={(value) => setMdValue(value as string | null)}>
        <SelectTrigger className="w-60">
          <SelectValue>{renderMdValue}</SelectValue>
          {mdValue && <SelectClear onClick={() => setMdValue(null)} />}
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={lgValue} onValueChange={(value) => setLgValue(value as string | null)}>
        <SelectTrigger size="lg" className="w-60">
          <SelectValue>{renderLgValue}</SelectValue>
          {lgValue && <SelectClear onClick={() => setLgValue(null)} />}
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
