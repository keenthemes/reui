'use client';

import { useId } from 'react';
import { useSliderInput } from '@/registry/default/hooks/use-slider-input';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { Slider, SliderThumb } from '@/registry/default/ui/slider';

const items = [
  { id: 1, price: 80 },
  { id: 2, price: 95 },
  { id: 3, price: 110 },
  { id: 4, price: 125 },
  { id: 5, price: 130 },
  { id: 120, price: 900 },
];

export default function PriceRangeSlider() {
  const id = useId();

  const minValue = Math.min(...items.map((item) => item.price));
  const maxValue = Math.max(...items.map((item) => item.price));

  const {
    sliderValues,
    inputValues,
    handleSliderChange,
    handleInputChange,
    validateAndUpdateValue,
  } = useSliderInput({
    minValue,
    maxValue,
    initialValue: [200, 800],
  });

  return (
    <div className="space-y-4">
      {/* Slider */}
      <div className="flex flex-col gap-2.5">
        <Label>Price Range</Label>
        <Slider
          value={sliderValues}
          onValueChange={handleSliderChange}
          min={minValue}
          max={maxValue}
          step={10}
          aria-label="Price Range Slider"
        >
          <SliderThumb />
          <SliderThumb />
        </Slider>
      </div>

      {/* Inputs */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2.5">
          <Label htmlFor={`${id}-min`}>Min Price</Label>
          <Input
            id={`${id}-min`}
            type="number"
            value={inputValues[0]}
            onChange={(e) => handleInputChange(e, 0)}
            onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
            placeholder={`$${minValue}`}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor={`${id}-max`}>Max Price</Label>
          <Input
            id={`${id}-max`}
            type="number"
            value={inputValues[1]}
            onChange={(e) => handleInputChange(e, 1)}
            onBlur={() => validateAndUpdateValue(inputValues[1], 1)}
            placeholder={`$${maxValue}`}
          />
        </div>
      </div>
    </div>
  );
}
