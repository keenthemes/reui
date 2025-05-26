'use client';

import { Button } from '@/registry/default/ui/button';
import { toast } from 'sonner';

export default function SonnerDemo() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        toast('Meeting Reminder', {
          description: 'Your team meeting today at 3:00 PM.',
          duration: 5000,
          action: {
            label: 'Join',
            onClick: () => console.log('Reschedule clicked'),
          },
        })
      }
    >
      Show Toast
    </Button>
  );
}
