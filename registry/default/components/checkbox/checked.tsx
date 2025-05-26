'use client';

import { useId, useState } from 'react';
import { Checkbox } from '@/registry/default/ui/checkbox';
import { Label } from '@/registry/default/ui/label';

export default function CheckboxDemo() {
  const id = useId();
  const [checked, setChecked] = useState<boolean>(true);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => setChecked(!!value)}
      />
      <Label htmlFor={id}>Accept terms and conditions</Label>
    </div>
  );
}
