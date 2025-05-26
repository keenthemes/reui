import * as React from 'react';
import { useCallback, useState } from 'react';

interface UseSliderInputProps {
  minValue: number;
  maxValue: number;
  initialValue: [number, number];
}

export function useSliderInput({
  minValue,
  maxValue,
  initialValue,
}: UseSliderInputProps) {
  const [sliderValues, setSliderValues] =
    useState<[number, number]>(initialValue);
  const [inputValues, setInputValues] =
    useState<[number, number]>(initialValue);

  // Handle slider changes and sync with input values
  const handleSliderChange = useCallback((values: [number, number]) => {
    setSliderValues(values);
    setInputValues(values);
  }, []);

  // Handle input changes for min or max
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
      const newValue = parseFloat(e.target.value);
      if (!isNaN(newValue)) {
        const updatedInputs = [...inputValues] as [number, number];
        updatedInputs[index] = newValue;
        setInputValues(updatedInputs);
      }
    },
    [inputValues],
  );

  // Validate and update slider values when input loses focus or user presses Enter
  const validateAndUpdateValue = useCallback(
    (value: number, index: 0 | 1) => {
      const updatedSlider = [...sliderValues] as [number, number];

      if (index === 0) {
        // Min value
        updatedSlider[0] = Math.max(minValue, Math.min(value, sliderValues[1]));
      } else {
        // Max value
        updatedSlider[1] = Math.min(maxValue, Math.max(value, sliderValues[0]));
      }

      setSliderValues(updatedSlider);
      setInputValues(updatedSlider);
    },
    [sliderValues, minValue, maxValue],
  );

  return {
    setSliderValues,
    setInputValues,
    sliderValues,
    inputValues,
    handleSliderChange,
    handleInputChange,
    validateAndUpdateValue,
  };
}
