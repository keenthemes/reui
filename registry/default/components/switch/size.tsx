import { Label } from '@/registry/default/ui/label';
import { Switch } from '@/registry/default/ui/switch';

export default function SwitchDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <Switch id="size-sm" size="sm" />
          <Label htmlFor="size-sm">Small</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="size-md" />
          <Label htmlFor="size-md">Medium</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="size-lg" size="lg" />
          <Label htmlFor="size-lg">Large</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="size-lg" size="xl" />
          <Label htmlFor="size-lg">XLarge</Label>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <Switch id="compact-size-sm" size="sm" shape="square" />
          <Label htmlFor="compact-size-sm">Small</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="compact-size-md" shape="square" />
          <Label htmlFor="compact-size-md">Medium</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="compact-size-lg" size="lg" shape="square" />
          <Label htmlFor="compact-size-lg">Large</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="compact-size-xl" size="xl" shape="square" />
          <Label htmlFor="compact-size-xl">XLarge</Label>
        </div>
      </div>
    </div>
  );
}
