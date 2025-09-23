'use client';

import { Label } from '@/registry/default/ui/base-label';
import { RadioGroup, RadioGroupItem } from '@/registry/default/ui/base-radio-group';

export default function Component() {
  return (
    <RadioGroup defaultValue="disabled-option2">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="disabled-option1" id="disabled-option1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="disabled-option2" id="disabled-option2" disabled />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="disabled-option3" id="disabled-option3" disabled />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </RadioGroup>
  );
}
