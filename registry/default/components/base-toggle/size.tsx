import { Toggle } from '@/registry/default/ui/base-toggle';
import { Italic } from 'lucide-react';

export default function Component() {
  return (
    <div className="flex justify-center items-center gap-5">
      <Toggle size="sm" aria-label="Toggle italic">
        <Italic />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <Italic />
      </Toggle>
      <Toggle size="lg" aria-label="Toggle italic">
        <Italic />
      </Toggle>
    </div>
  );
}
