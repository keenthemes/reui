import { Kbd } from '@/registry/default/ui/kbd';
import { ArrowDown, ArrowUp, Command } from 'lucide-react';

export default function ButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Kbd size="xs">
          <ArrowUp />
        </Kbd>
        <Kbd size="xs">
          <ArrowDown />
        </Kbd>
        <Kbd size="xs">space</Kbd>
        <Kbd size="xs">
          <Command /> +K
        </Kbd>
      </div>

      <div className="flex items-center gap-4">
        <Kbd size="sm">
          <ArrowUp />
        </Kbd>
        <Kbd size="sm">
          <ArrowDown />
        </Kbd>
        <Kbd size="sm">space</Kbd>
        <Kbd size="sm">
          <Command /> +K
        </Kbd>
      </div>

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
    </div>
  );
}
