import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/registry/default/ui/base-toggle-group';

export default function TabsDemo() {
  const [value, setValue] = useState('1W');

  return (
    <ToggleGroup
      toggleMultiple={false}
      value={[value]}
      onValueChange={(newValue) => {
        if (newValue) setValue(newValue[0]);
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
