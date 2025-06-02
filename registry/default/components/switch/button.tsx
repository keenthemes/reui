import { useId } from 'react';
import { Switch, SwitchIndicator, SwitchWrapper } from '@/registry/default/ui/switch';

export default function SwitchDemo() {
  const id = useId();

  return (
    <div className="flex items-center space-x-2.5">
      <SwitchWrapper permanent={true} className="w-60 inline-grid">
        <Switch id={id} size="xl" className="w-full rounded-md h-9" thumbClassName="rounded-md" />
        <SwitchIndicator state="on" className="w-1/2 text-accent-foreground peer-data-[state=unchecked]:text-primary">
          Partial upload
        </SwitchIndicator>
        <SwitchIndicator state="off" className="w-1/2 text-accent-foreground peer-data-[state=checked]:text-primary">
          Full upload
        </SwitchIndicator>
      </SwitchWrapper>
    </div>
  );
}
