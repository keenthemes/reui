import { Slider } from '@/registry/default/ui/base-slider';

export default function Component() {
  return (
    <div className="*:not-first:mt-4 w-full max-w-xs">
      <div className="flex h-40 justify-center">
        <Slider
          defaultValue={[2, 7]}
          max={10}
          orientation="vertical"
          aria-label="Vertical slider"
          showTooltip={true}
          tooltipContent={(value) => `Value: ${value}`}
          tooltipVariant="light"
        />
      </div>
    </div>
  );
}
