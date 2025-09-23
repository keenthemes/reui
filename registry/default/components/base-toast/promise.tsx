'use client';

import { toastManager } from '@/registry/default/hooks/use-toast';
import { Button } from '@/registry/default/ui/base-button';

export default function ToastPromiseDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toastManager.promise(
          new Promise<string>((resolve) => {
            setTimeout(() => {
              resolve('Request has been sent');
            }, 2000);
          }),
          {
            loading: { title: 'Sending request...', data: { close: true } },
            success: (data: string) => ({ title: `Success: ${data}`, data: { close: true } }),
            error: (err: Error) => ({ title: `Error: ${err.message}`, data: { close: true } }),
          },
        )
      }
    >
      Show Toast
    </Button>
  );
}
