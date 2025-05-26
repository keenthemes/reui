import { useId } from 'react';
import { Label } from '@/registry/default/ui/label';
import {
  Switch,
  SwitchIndicator,
  SwitchWrapper,
} from '@/registry/default/ui/switch';

export default function SwitchDemo() {
  const id = useId();

  return (
    <div className="flex items-center space-x-2.5">
      <SwitchWrapper>
        <Switch id={id} size="xl" />
        <SwitchIndicator
          state="off"
          className="text-[10px] font-medium text-muted-foreground uppercase"
        >
          Off
        </SwitchIndicator>
        <SwitchIndicator
          state="on"
          className="text-[10px] font-medium text-primary-foreground uppercase"
        >
          On
        </SwitchIndicator>
      </SwitchWrapper>
      <Label htmlFor={id}>Text Indicator</Label>
    </div>
  );
}
