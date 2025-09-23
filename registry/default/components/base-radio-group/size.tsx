'use client';

import { Label } from '@/registry/default/ui/base-label';
import { RadioGroup, RadioGroupItem } from '@/registry/default/ui/base-radio-group';

export default function Component() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div>
        <RadioGroup defaultValue="small-option-1" size="sm">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small-option-1" id="small-option-1" />
            <Label htmlFor="small-option-1">Small 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small-option-2" id="small-option-2" />
            <Label htmlFor="small-option-2">Small 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small-option-3" id="small-option-3" />
            <Label htmlFor="small-option-3">Small 3</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <RadioGroup defaultValue="medium-option-1" size="md">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium-option-1" id="medium-option-1" />
            <Label htmlFor="medium-option-1">Medium 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium-option-2" id="medium-option-2" />
            <Label htmlFor="medium-option-2">Medium 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium-option-3" id="medium-option-3" />
            <Label htmlFor="medium-option-3">Medium 3</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <RadioGroup defaultValue="large-option-1" size="lg">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large-option-1" id="large-option-1" />
            <Label htmlFor="large-option-1">Large 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large-option-2" id="large-option-2" />
            <Label htmlFor="large-option-2">Large 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large-option-3" id="large-option-3" />
            <Label htmlFor="large-option-3">Large 3</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
