import { ToggleGroup, ToggleGroupItem } from '@/registry/default/ui/toggle-group';

export default function TabsDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <ToggleGroup type="multiple" variant="outline" size="sm" defaultValue={['1W', '1M']}>
        <ToggleGroupItem value="1D">1D</ToggleGroupItem>
        <ToggleGroupItem value="1W">1W</ToggleGroupItem>
        <ToggleGroupItem value="1M">1M</ToggleGroupItem>
        <ToggleGroupItem value="6M">6M</ToggleGroupItem>
        <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" variant="outline" defaultValue={['1W', '1M']}>
        <ToggleGroupItem value="1D">1D</ToggleGroupItem>
        <ToggleGroupItem value="1W">1W</ToggleGroupItem>
        <ToggleGroupItem value="1M">1M</ToggleGroupItem>
        <ToggleGroupItem value="6M">6M</ToggleGroupItem>
        <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" variant="outline" size="lg" defaultValue={['1W', '1M']}>
        <ToggleGroupItem value="1D">1D</ToggleGroupItem>
        <ToggleGroupItem value="1W">1W</ToggleGroupItem>
        <ToggleGroupItem value="1M">1M</ToggleGroupItem>
        <ToggleGroupItem value="6M">6M</ToggleGroupItem>
        <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
