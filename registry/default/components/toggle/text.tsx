import { Toggle } from '@/registry/default/ui/toggle';
import { Italic } from 'lucide-react';

export default function Component() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic />
      Italic
    </Toggle>
  );
}
