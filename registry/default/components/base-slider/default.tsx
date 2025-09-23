import { Slider, SliderThumb } from '@/registry/default/ui/base-slider';

export default function SliderDemo() {
  return (
    <div className="w-full max-w-xs">
      <Slider defaultValue={[50]} max={100} step={1}>
        <SliderThumb />
      </Slider>
    </div>
  );
}
