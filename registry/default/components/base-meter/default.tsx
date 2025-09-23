import { Meter, MeterLabel, MeterValue } from '@/registry/default/ui/base-meter';

export default function MeterDemo() {
  return (
    <Meter className="mx-auto w-48" value={4} max={5}>
      <div className="flex items-center justify-between">
        <MeterLabel>Tasks Completed</MeterLabel>
        <MeterValue>{(formattedValue, value) => `${value} / 5`}</MeterValue>
      </div>
    </Meter>
  );
}
