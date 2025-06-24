import { CountingNumber } from '@/registry/default/ui/counting-number';

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <CountingNumber from={0} to={500} duration={3} className="text-4xl font-bold" />
    </div>
  );
} 