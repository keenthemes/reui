import { Slider, SliderThumb } from '@/registry/default/ui/base-slider';

export default function SliderDemo() {
  return (
    <div className="w-full max-w-xs">
      <Slider defaultValue={[100, 450]} min={0} max={600} step={1}>
        <SliderThumb />
        <SliderThumb />
      </Slider>
    </div>
  );
}
