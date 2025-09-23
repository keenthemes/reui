import { Slider } from '@/registry/default/ui/base-slider';

export default function Component() {
  return (
    <div className="*:not-first:mt-4 w-full max-w-xs">
      <div>
        <span
          className="text-muted-foreground mb-3 flex w-full items-center justify-between gap-2 text-xs font-medium"
          aria-hidden="true"
        >
          <span>Low</span>
          <span>High</span>
        </span>
        <Slider defaultValue={[50]} step={10} showTooltip={true} aria-label="Slider with labels and tooltip" />
      </div>
    </div>
  );
}
