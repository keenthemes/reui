import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/default/ui/base-select';

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

export default function IndicatorPositionDemo() {
  return (
    <Select items={items} indicatorPosition="right">
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Select a fruit" />
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
