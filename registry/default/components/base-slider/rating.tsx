'use client';

import { useState } from 'react';
import { Label } from '@/registry/default/ui/base-label';
import { Slider, SliderThumb } from '@/registry/default/ui/base-slider';

export default function Component() {
  const [value, setValue] = useState([3]);

  const labels = ['Awful', 'Poor', 'Okay', 'Good', 'Amazing'];

  return (
    <div className="space-y-3 w-full max-w-xs">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">Rate your experience</Label>
        <span className="text-sm font-medium">{labels[value[0] - 1]}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">😡</span>
        <Slider
          value={value}
          onValueChange={(newValue) => setValue(newValue as number[])}
          min={1}
          max={5}
          aria-label="Rate your experience"
        >
          <SliderThumb />
        </Slider>
        <span className="text-2xl">😍</span>
      </div>
    </div>
  );
}
