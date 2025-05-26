import { Label } from '@/registry/default/ui/label';
import { Switch } from '@/registry/default/ui/switch';

export default function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" disabled />
      <Label htmlFor="airplane-mode">Disabled</Label>
    </div>
  );
}
