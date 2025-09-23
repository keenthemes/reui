'use client';

import * as React from 'react';
import { Label } from '@/registry/default/ui/base-label';
import { PhoneInput } from '@/registry/default/ui/base-phone-input';

export default function BasePhoneInputSize() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">Small</Label>
        <PhoneInput
          variant="sm"
          placeholder="Enter phone number"
          popupClassName="w-xs"
          scrollAreaClassName="h-[300px]"
        />
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Medium(Default)</Label>
        <PhoneInput placeholder="Enter phone number" popupClassName="w-xs" scrollAreaClassName="h-[300px]" />
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Large</Label>
        <PhoneInput
          variant="lg"
          placeholder="Enter phone number"
          popupClassName="w-xs"
          scrollAreaClassName="h-[300px]"
        />
      </div>
    </div>
  );
}
