'use client';

import * as React from 'react';
import { PhoneInput } from '@/registry/default/ui/base-phone-input';

export default function BasePhoneInputDefault() {
  return (
    <div className="w-full max-w-xs">
      <PhoneInput placeholder="Enter phone number" popupClassName="w-xs" scrollAreaClassName="h-[300px]" />
    </div>
  );
}
