'use client';

import { NumberField, NumberFieldScrubArea } from '@/registry/default/ui/base-number-field';

export default function NumberFieldDefault() {
  return (
    <div className="space-y-2">
      <NumberField className="mx-auto" defaultValue={5} min={0} max={100}>
        <NumberFieldScrubArea>Amount</NumberFieldScrubArea>
      </NumberField>
    </div>
  );
}
