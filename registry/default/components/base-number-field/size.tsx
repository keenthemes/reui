'use client';

import { NumberField, NumberFieldScrubArea } from '@/registry/default/ui/base-number-field';

export default function NumberFieldSize() {
  return (
    <div className="flex flex-col gap-6 justify-start items-start">
      <NumberField defaultValue={5} min={0} max={100} size="sm">
        <NumberFieldScrubArea>Small</NumberFieldScrubArea>
      </NumberField>

      <NumberField defaultValue={5} min={0} max={100}>
        <NumberFieldScrubArea>Medium</NumberFieldScrubArea>
      </NumberField>

      <NumberField defaultValue={5} min={0} max={100} size="lg">
        <NumberFieldScrubArea>Large</NumberFieldScrubArea>
      </NumberField>
    </div>
  );
}
