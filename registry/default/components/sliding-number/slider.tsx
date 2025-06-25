'use client';

import { useState } from 'react';
import { Slider, SliderThumb } from '@/registry/default/ui/slider';
import { SlidingNumber } from '@/registry/default/ui/sliding-number';

export default function SlidingNumberSliderDemo() {
  const [value, setValue] = useState(100);
  const [previousValue, setPreviousValue] = useState(100);

  const handleSliderChange = (newValue: number[]) => {
    const currentValue = newValue[0] * 10; // Convert 0-100 to 0-1000
    setPreviousValue(value);
    setValue(currentValue);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-2.5 lg:w-40">
      <div className="flex flex-col items-start justify-start">
        <p className="text-sm text-muted-foreground">Current ARR:</p>
        <div className="inline-flex items-center gap-0.5 text-3xl font-bold">
          $
          <SlidingNumber from={previousValue} to={value} duration={0.5} startOnView={false} />
        </div>
      </div>
      <div className="space-y-2">
        <Slider defaultValue={[10]} min={0} max={100} step={1} onValueChange={handleSliderChange} className="w-full">
          <SliderThumb />
        </Slider>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$1,000</span>
        </div>
      </div>
    </div>
  );
}
