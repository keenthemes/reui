'use client';

import { useToast } from '@/registry/default/hooks/use-toast';
import { Button } from '@/registry/default/ui/base-button';

export default function ToastPositionsDemo() {
  const toast = useToast();

  return (
    <div className="items-center gap-2 grid grid-cols-3">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Toast at Top Left',
            data: { position: 'top-left' },
          })
        }
      >
        Top Left
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Toast at Top Center',
            data: { position: 'top-center' },
          })
        }
      >
        Top Center
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Toast at Top Right',
            data: { position: 'top-right' },
          })
        }
      >
        Top Right
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Toast at Bottom Left',
            data: { position: 'bottom-left' },
          })
        }
      >
        Bottom Left
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Toast at Bottom Center',
            data: { position: 'bottom-center' },
          })
        }
      >
        Bottom Center
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Toast at Bottom Right',
            data: { position: 'bottom-right' },
          })
        }
      >
        Bottom Right
      </Button>
    </div>
  );
}
