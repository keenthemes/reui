import { Toggle } from '@/registry/default/ui/base-toggle';
import { Italic } from 'lucide-react';

export default function ToggleOutline() {
  return (
    <Toggle variant="outline" aria-label="Toggle italic">
      <Italic />
    </Toggle>
  );
}
