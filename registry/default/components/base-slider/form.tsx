'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/registry/default/ui/base-button';
import { Input } from '@/registry/default/ui/base-input';
import { Label } from '@/registry/default/ui/base-label';
import { Slider, SliderThumb } from '@/registry/default/ui/base-slider';
import { Droplets, RotateCcwIcon, Thermometer, Wind } from 'lucide-react';

function ClimateSlider({
  minValue,
  maxValue,
  initialValue,
  defaultValue,
  label,
  icon,
  onRegisterReset,
  disabled = false,
}: {
  minValue: number;
  maxValue: number;
  initialValue: number[];
  defaultValue: number[];
  label: string;
  unit: string;
  icon: React.ReactNode;
  onRegisterReset: (resetFn: () => void) => void;
  disabled?: boolean;
}) {
  const [sliderValue, setSliderValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue[0].toString());

  // Handle slider change
  const handleSliderChange = (newValue: number | readonly number[]) => {
    const value = Array.isArray(newValue) ? [...newValue] : [newValue];
    setSliderValue(value);
    setInputValue(value[0].toString());
  };

  // Register the reset function when the component mounts
  React.useEffect(() => {
    const resetToDefault = () => {
      setSliderValue(defaultValue);
      setInputValue(defaultValue[0].toString());
    };
    onRegisterReset(resetToDefault);
  }, [onRegisterReset, defaultValue]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Validate and update value from input
  const validateAndUpdateValue = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= minValue && numValue <= maxValue) {
      setSliderValue([numValue]);
    } else {
      // Reset to current slider value if invalid
      setInputValue(sliderValue[0].toString());
    }
  };

  return (
    <div className="w-full space-y-0.5">
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground">{icon}</div>
        <Label className="text-sm font-medium">{label}</Label>
      </div>

      <div className="flex items-center gap-5">
        <Slider
          className="grow"
          value={sliderValue}
          onValueChange={handleSliderChange}
          min={minValue}
          max={maxValue}
          step={0.5}
          disabled={disabled}
          aria-label={label}
        >
          <SliderThumb />
        </Slider>

        <Input
          className="h-8 w-16 px-2 py-1 text-center"
          type="number"
          inputMode="decimal"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={validateAndUpdateValue}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              validateAndUpdateValue();
            }
          }}
          disabled={disabled}
          aria-label={`Enter ${label.toLowerCase()} value`}
        />
      </div>
    </div>
  );
}

export default function Component() {
  // Create refs to store reset functions
  const resetFunctionsRef = useRef<(() => void)[]>([]);
  // Function to reset all sliders to default
  const resetAll = () => {
    resetFunctionsRef.current.forEach((resetFn) => resetFn());
  };

  // Function to register reset functions
  const registerResetFunction = (resetFn: () => void, index: number) => {
    resetFunctionsRef.current[index] = resetFn;
  };

  return (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-3">
        <ClimateSlider
          minValue={16}
          maxValue={30}
          initialValue={[22]}
          defaultValue={[22]}
          label="Temperature"
          unit="°C"
          icon={<Thermometer className="w-4 h-4" />}
          onRegisterReset={(resetFn) => registerResetFunction(resetFn, 0)}
        />
        <ClimateSlider
          minValue={30}
          maxValue={80}
          initialValue={[50]}
          defaultValue={[50]}
          label="Humidity"
          unit="%"
          icon={<Droplets className="w-4 h-4" />}
          onRegisterReset={(resetFn) => registerResetFunction(resetFn, 1)}
        />
        <ClimateSlider
          minValue={0}
          maxValue={10}
          initialValue={[3]}
          defaultValue={[3]}
          label="Fan Speed"
          unit=""
          icon={<Wind className="w-4 h-4" />}
          onRegisterReset={(resetFn) => registerResetFunction(resetFn, 2)}
        />
      </div>

      <Button className="w-full" variant="outline" onClick={resetAll}>
        <RotateCcwIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
        Reset to Defaults
      </Button>
    </div>
  );
}
