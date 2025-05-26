import { Kbd } from '@/registry/default/ui/kbd';
import { ArrowDown, ArrowUp, Command } from 'lucide-react';

export default function ButtonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Kbd variant="outline">
        <ArrowUp />
      </Kbd>
      <Kbd variant="outline">
        <ArrowDown />
      </Kbd>
      <Kbd variant="outline">space</Kbd>
      <Kbd variant="outline">
        <Command /> +K
      </Kbd>
    </div>
  );
}
