import { SetStateAction, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/registry/default/ui/toggle-group';

export default function TabsDemo() {
  const [value, setValue] = useState<string>('1W');

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(newValue: SetStateAction<string>) => {
        if (newValue) setValue(newValue);
      }}
    >
      <ToggleGroupItem value="1D">1D</ToggleGroupItem>
      <ToggleGroupItem value="1W">1W</ToggleGroupItem>
      <ToggleGroupItem value="1M">1M</ToggleGroupItem>
      <ToggleGroupItem value="6M">6M</ToggleGroupItem>
      <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
    </ToggleGroup>
  );
}
