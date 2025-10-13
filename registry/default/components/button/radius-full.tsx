import { Button } from '@/registry/default/ui/button';
import { CalendarCheck } from 'lucide-react';

export default function ButtonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" radius="full">
        Circle button
      </Button>
      <Button variant="outline" radius="full" mode="icon">
        <CalendarCheck />
      </Button>
    </div>
  );
}
