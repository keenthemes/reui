import { Label } from '@/registry/default/ui/base-label';
import { Switch } from '@/registry/default/ui/base-switch';

export default function SwitchSizeDemo() {
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
      </div>
    </div>
  );
}
