import { Button } from '@/registry/default/ui/base-button';
import { Bell, CalendarCheck, Trash2 } from 'lucide-react';

export default function Component() {
  return (
    <div className="flex items-center gap-4">
      <Button variant="primary">
        <Trash2 /> Primary
      </Button>
      <Button variant="outline">
        <Bell /> Outline
      </Button>
      <Button variant="ghost">
        <CalendarCheck /> Ghost
      </Button>
    </div>
  );
}
