'use client';

import { useId } from 'react';
import { Label } from '@/registry/default/ui/label';
import { RadioGroup, RadioGroupItem } from '@/registry/default/ui/radio-group';

export default function RadioGroupDemo() {
  const id1 = useId();
  const id2 = useId();
  const id3 = useId();

  return (
    <RadioGroup defaultValue="intermediate">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="beginner" id={id1} />
        <Label htmlFor={id1} variant="secondary">
          Beginner
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="intermediate" id={id2} />
        <Label htmlFor={id2} variant="secondary">
          Intermediate
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="advanced" id={id3} />
        <Label htmlFor={id3} variant="secondary">
          Advanced
        </Label>
      </div>
    </RadioGroup>
  );
}
