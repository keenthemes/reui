'use client';

import { useId } from 'react';
import { Checkbox } from '@/registry/default/ui/base-checkbox';
import { Label } from '@/registry/default/ui/base-label';

export default function Component() {
  const id = useId();

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} defaultChecked />
      <Label htmlFor={id}>Checked by default</Label>
    </div>
  );
} 