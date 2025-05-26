import { Kbd } from '@/registry/default/ui/kbd';
import { ArrowDown, ArrowUp, Command } from 'lucide-react';

export default function ButtonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Kbd>
        <ArrowUp />
      </Kbd>
      <Kbd>
        <ArrowDown />
      </Kbd>
      <Kbd>space</Kbd>
      <Kbd>
        <Command /> +K
      </Kbd>
    </div>
  );
}
