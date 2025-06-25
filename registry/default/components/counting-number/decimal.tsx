import { CountingNumber } from '@/registry/default/ui/counting-number';

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <CountingNumber
        from={0}
        to={99.99}
        duration={3}
        className="text-4xl font-bold"
        format={(value) => value.toFixed(2)}
      />
    </div>
  );
}
