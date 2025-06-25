import { SlidingNumber } from '@/registry/default/ui/sliding-number';

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <SlidingNumber from={0} to={500} duration={1} className="text-4xl font-bold" digitHeight={40} />
    </div>
  );
}
