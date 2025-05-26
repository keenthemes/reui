'use client';

import { useId } from 'react';
import { useSliderInput } from '@/registry/default/hooks/use-slider-input';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/default/ui/form';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { Slider, SliderThumb } from '@/registry/default/ui/slider';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Mock data
const items = [
  { id: 1, price: 80 },
  { id: 2, price: 95 },
  { id: 3, price: 110 },
  { id: 120, price: 900 },
];

// Form schema using zod
const FormSchema = z.object({
  range: z
    .array(z.number())
    .length(2, 'You must select both minimum and maximum values.')
    .refine(([min, max]) => max > min, {
      message: 'Maximum value must be greater than the minimum value.',
    })
    .refine(([min, max]) => min >= 100 && max <= 600, {
      message: 'Values must be within the range of 100 to 600.',
    }),
});

export default function PriceRangeForm() {
  const id = useId();
  const minValue = Math.min(...items.map((item) => item.price));
  const maxValue = Math.max(...items.map((item) => item.price));

  const {
    sliderValues,
    setSliderValues,
    inputValues,
    handleSliderChange,
    handleInputChange,
    validateAndUpdateValue,
  } = useSliderInput({
    minValue,
    maxValue,
    initialValue: [200, 500],
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { range: [100, 450] },
  });

  // Handle form submission
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>{`Form submitted! Range: ${data.range[0]} - ${data.range[1]}`}</AlertTitle>
      </Alert>
    ));
  }

  // Updated handleSliderChange to reset form errors
  const handleSliderChangeWithValidation = (values: [number, number]) => {
    handleSliderChange(values); // Update slider values
    form.setValue('range', values); // Update form values
    form.trigger('range'); // Trigger validation to reset errors
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          // Update slider range in the form value before submission
          form.setValue('range', sliderValues);
          onSubmit(data);
        })}
        className="w-full md:w-[400px] space-y-6"
      >
        {/* Slider and Inputs */}
        <FormField
          control={form.control}
          name="range"
          render={() => (
            <FormItem>
              <FormLabel>Select Price Range</FormLabel>
              {/* Slider */}
              <Slider
                value={sliderValues}
                onValueChange={handleSliderChangeWithValidation} // Use the updated handler
                min={minValue}
                max={maxValue}
                step={10}
              >
                <SliderThumb />
                <SliderThumb />
              </Slider>

              {/* Inputs as indicators */}
              <div className="flex items-center justify-between mt-4 gap-4">
                <div>
                  <Label htmlFor={`${id}-min`}>Min Price</Label>
                  <Input
                    id={`${id}-min`}
                    type="number"
                    value={inputValues[0]}
                    onChange={(e) => handleInputChange(e, 0)}
                    onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${id}-max`}>Max Price</Label>
                  <Input
                    id={`${id}-max`}
                    type="number"
                    value={inputValues[1]}
                    onChange={(e) => handleInputChange(e, 1)}
                    onBlur={() => validateAndUpdateValue(inputValues[1], 1)}
                  />
                </div>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit and Reset */}
        <div className="flex justify-end gap-2">
          <Button
            type="reset"
            variant="outline"
            onClick={() => {
              form.reset();
              setSliderValues([100, 450]);
            }}
          >
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
