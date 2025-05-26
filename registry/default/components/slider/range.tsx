import { Slider, SliderThumb } from '@/registry/default/ui/slider';

export default function SliderDemo() {
  return (
    <div className="w-full md:w-[400px]">
      <Slider defaultValue={[100, 450]} min={0} max={600} step={1}>
        <SliderThumb />
        <SliderThumb />
      </Slider>
    </div>
  );
}
