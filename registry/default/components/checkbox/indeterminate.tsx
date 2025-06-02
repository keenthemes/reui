'use client';

import { useId, useState } from 'react';
import { Checkbox } from '@/registry/default/ui/checkbox';
import { Label } from '@/registry/default/ui/label';

export default function CheckboxDemo() {
  const id = useId();
  const [checked, setChecked] = useState<'indeterminate' | boolean>('indeterminate');

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={setChecked} />
      <Label htmlFor={id}>Indeterminate state</Label>
    </div>
  );
}
