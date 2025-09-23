import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/default/ui/base-select';

const items = [
  {
    label: 'Select fruits',
    value: null,
  },
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
  {
    label: 'Strawberry',
    value: 'strawberry',
  },
  {
    label: 'Blueberry',
    value: 'blueberry',
  },
];

export default function BaseSelectMultipleDemo() {
  const renderValue = (value: string[]) => {
    const MAX_COUNT = 2;

    if (value.length === 0) return 'Select fruits';
    const labels = value.map((val) => items.find((item) => item.value === val)?.label).filter(Boolean);

    if (labels.length <= MAX_COUNT) {
      return labels.join(', ');
    }

    const firstThree = labels.slice(0, MAX_COUNT);
    const remaining = labels.length - MAX_COUNT;
    return `${firstThree.join(', ')}, +${remaining} more`;
  };

  return (
    <Select items={items} defaultValue={['apple', 'banana']} multiple>
      <SelectTrigger className="w-60">
        <SelectValue className="truncate">{renderValue}</SelectValue>
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
