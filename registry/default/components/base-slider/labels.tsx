'use client';

import { useState } from 'react';
import { Label } from '@/registry/default/ui/base-label';
import { Slider, SliderThumb } from '@/registry/default/ui/base-slider';

export default function Component() {
  const min_price = 5;
  const max_price = 1240;
  const [value, setValue] = useState([min_price, max_price]);

  const formatPrice = (price: number) => {
    return price === max_price ? `$${price.toLocaleString()}+` : `$${price.toLocaleString()}`;
  };

  return (
    <div className="*:not-first:mt-3.5 w-full max-w-xs">
      <Label className="tabular-nums">
        From {formatPrice(value[0])} to {formatPrice(value[1])}
      </Label>
      <div className="flex items-center gap-4">
        <Slider
          value={value}
          onValueChange={(newValue) => setValue(newValue as number[])}
          min={min_price}
          max={max_price}
          aria-label="Price range slider"
        >
          <SliderThumb />
          <SliderThumb />
        </Slider>
      </div>
    </div>
  );
}
