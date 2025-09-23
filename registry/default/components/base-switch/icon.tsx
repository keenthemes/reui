import { Switch, SwitchThumb } from '@/registry/default/ui/base-switch';
import { MoonIcon, SunIcon } from 'lucide-react';

export default function SwitchDemo() {
  return (
    <div className="flex items-center">
      <Switch size="lg">
        <SwitchThumb className="group/thumb">
          <SunIcon className="size-3.5 group-data-[checked]/thumb:hidden" />
          <MoonIcon className="size-3.5 hidden group-data-[checked]/thumb:block" />
        </SwitchThumb>
      </Switch>
    </div>
  );
}
