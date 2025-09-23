import { Toggle } from '@/registry/default/ui/base-toggle';
import { Bold } from 'lucide-react';

export default function Component() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  );
}
