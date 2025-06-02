'use client';

import { useEffect, useState } from 'react';
import { Slider, SliderThumb } from '@/registry/default/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/default/ui/tooltip';

export default function SliderDemo() {
  const [value, setValue] = useState<number[]>([100, 450]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="w-full md:w-[400px]">
      <Slider
        defaultValue={[100, 450]}
        min={0}
        max={600}
        step={1}
        onValueChange={(val) => {
          setValue(val);
        }}
      >
        <TooltipProvider>
          <Tooltip open={isOpen}>
            <TooltipTrigger asChild>
              <SliderThumb />
            </TooltipTrigger>
            <TooltipContent side="top" forceMount>
              {value[1] ?? 0}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip open={isOpen}>
            <TooltipTrigger asChild>
              <SliderThumb />
            </TooltipTrigger>
            <TooltipContent side="top" forceMount>
              {value[1] ?? 0}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Slider>
    </div>
  );
}
