'use client';

import { Label } from '@/registry/default/ui/base-label';
import { RadioGroup, RadioGroupItem } from '@/registry/default/ui/base-radio-group';

export default function Component() {
  return (
    <RadioGroup defaultValue="checked-option-2">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="checked-option-1" id="checked-option-1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="checked-option-2" id="checked-option-2" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="checked-option-3" id="checked-option-3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </RadioGroup>
  );
}
