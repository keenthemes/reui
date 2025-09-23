'use client';

import { useToast } from '@/registry/default/hooks/use-toast';
import { Button } from '@/registry/default/ui/base-button';

export default function ToastCloseDemo() {
  const toast = useToast();

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Toast with close button',
            description: 'This toast has a close button enabled',
            data: { close: true },
          })
        }
      >
        Show Toast
      </Button>
    </div>
  );
}
