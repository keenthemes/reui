import { Label } from '@/registry/default/ui/base-label';
import { Switch } from '@/registry/default/ui/base-switch';

export default function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" disabled />
      <Label htmlFor="airplane-mode">Disabled</Label>
    </div>
  );
}
