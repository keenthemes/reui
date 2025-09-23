'use client';

import { Label } from '@/registry/default/ui/base-label';
import { RadioGroup, RadioGroupItem } from '@/registry/default/ui/base-radio-group';

export default function Component() {
  return (
    <RadioGroup defaultValue="default-option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default-option-1" id="default-option-1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default-option-2" id="default-option-2" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default-option-3" id="default-option-3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </RadioGroup>
  );
}
