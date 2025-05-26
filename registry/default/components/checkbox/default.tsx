'use client';

import { useId } from 'react';
import { Checkbox } from '@/registry/default/ui/checkbox';
import { Label } from '@/registry/default/ui/label';

export default function CheckboxDemo() {
  const id = useId();

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} />
      <Label htmlFor={id}>Accept terms and conditions</Label>
    </div>
  );
}
