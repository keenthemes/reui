'use client';

import { useId, useState } from 'react';
import { Checkbox } from '@/registry/default/ui/base-checkbox';
import { Label } from '@/registry/default/ui/base-label';

export default function Component() {
  const id = useId();
  const [checked, setChecked] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(true);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        indeterminate={indeterminate}
        onCheckedChange={(newChecked) => {
          setChecked(newChecked as boolean);
          setIndeterminate(false);
        }}
      />
      <Label htmlFor={id}>Indeterminate state</Label>
    </div>
  );
}
