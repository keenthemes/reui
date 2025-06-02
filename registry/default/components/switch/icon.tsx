import { useId } from 'react';
import { Label } from '@/registry/default/ui/label';
import { Switch, SwitchIndicator, SwitchWrapper } from '@/registry/default/ui/switch';
import { Moon, Sun } from 'lucide-react';

export default function SwitchDemo() {
  const id = useId();
  const id2 = useId();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center space-x-2.5">
        <SwitchWrapper>
          <Switch id={id} size="xl" />
          <SwitchIndicator state="on">
            <Sun className="size-4 text-primary-foreground" />
          </SwitchIndicator>
          <SwitchIndicator state="off">
            <Moon className="size-4 text-muted-foreground" />
          </SwitchIndicator>
        </SwitchWrapper>
        <Label htmlFor={id}>Icon Indicator</Label>
      </div>
      <div className="flex items-center space-x-2.5">
        <SwitchWrapper permanent={true}>
          <Switch id={id2} size="xl" />
          <SwitchIndicator state="on">
            <Sun className="size-4 text-muted-foreground" />
          </SwitchIndicator>
          <SwitchIndicator state="off">
            <Moon className="size-4 text-muted-foreground" />
          </SwitchIndicator>
        </SwitchWrapper>
        <Label htmlFor={id2}>Permanent Indicator</Label>
      </div>
    </div>
  );
}
