'use client';

import { useId, useState } from 'react';
import { Checkbox } from '@/registry/default/ui/checkbox';
import { Label } from '@/registry/default/ui/label';

export default function CheckboxDemo() {
  const id = useId();
  const [checked, setChecked] = useState<boolean>(true);

  const id2 = useId();
  const [checked2, setChecked2] = useState<boolean>(true);

  const id3 = useId();
  const [checked3, setChecked3] = useState<boolean>(true);

  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          size="sm"
          onCheckedChange={(value) => setChecked(!!value)}
        />
        <Label htmlFor={id}>Small</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id={id2}
          checked={checked2}
          onCheckedChange={(value) => setChecked2(!!value)}
        />
        <Label htmlFor={id2}>Medium</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id={id3}
          checked={checked3}
          size="lg"
          onCheckedChange={(value) => setChecked3(!!value)}
        />
        <Label htmlFor={id3}>Large</Label>
      </div>
    </div>
  );
}
