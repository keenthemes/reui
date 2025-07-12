'use client';

import { useId } from 'react';
import { Checkbox } from '@/registry/default/ui/base-checkbox';
import { Label } from '@/registry/default/ui/base-label';

export default function Component() {
  const smallId = useId();
  const mediumId = useId();
  const largeId = useId();

  return (
    <div className="flex items-center flex-wrap gap-10">
      <div className="flex items-center space-x-2">
        <Checkbox id={smallId} size="sm" defaultChecked />
        <Label htmlFor={smallId}>Small</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id={mediumId} size="md" defaultChecked />
        <Label htmlFor={mediumId}>Medium</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id={largeId} size="lg" defaultChecked />
        <Label htmlFor={largeId}>Large</Label>
      </div>
    </div>
  );
}
