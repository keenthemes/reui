import { useId } from 'react';
import { Label } from '@/registry/default/ui/label';
import { Switch } from '@/registry/default/ui/switch';

export default function SwitchDemo() {
  const id = useId();

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 has-data-[state=checked]:border-primary">
        <Switch id={id} size="sm" className="order-1" aria-describedby={`${id}-description`} />
        <div className="grid grow gap-2">
          <Label htmlFor={id}>Enable Notifications</Label>
          <p id={`${id}-description`} className="text-xs text-muted-foreground">
            A short description goes here.
          </p>
        </div>
      </div>
    </div>
  );
}
