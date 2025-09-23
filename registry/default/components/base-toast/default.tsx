'use client';

import { useToast } from '@/registry/default/hooks/use-toast';
import { Button } from '@/registry/default/ui/base-button';

export default function ToastDemo() {
  const toast = useToast();

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Your request has been sent',
            description: "We'll get back to you as soon as possible",
          })
        }
      >
        Show Toast
      </Button>
    </div>
  );
}
