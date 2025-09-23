'use client';

import { useToast } from '@/registry/default/hooks/use-toast';
import { Alert, AlertIcon, AlertTitle, AlertToolbar } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/base-button';
import { CircleAlert } from 'lucide-react';

export default function ToastDemo() {
  const toast = useToast();

  return (
    <div className="items-center gap-2 grid grid-cols-3">
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.add({
            data: {
              content: (
                <Alert close={true} onClose={() => toast.close(id)} className="border border-border shadow-lg">
                  <AlertIcon>
                    <CircleAlert />
                  </AlertIcon>
                  <AlertTitle>This is a primary alert</AlertTitle>
                  <AlertToolbar>
                    <Button variant="inverse" mode="link" underlined="solid" size="sm" className="flex mt-0.5">
                      Upgrade
                    </Button>
                  </AlertToolbar>
                </Alert>
              ),
            },
          });
        }}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.add({
            data: {
              content: (
                <Alert close={true} variant="mono" icon="primary" onClose={() => toast.close(id)}>
                  <AlertIcon>
                    <CircleAlert />
                  </AlertIcon>
                  <AlertTitle>This is a primary alert</AlertTitle>
                </Alert>
              ),
            },
          });
        }}
      >
        Primary
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.add({
            data: {
              content: (
                <Alert close={true} variant="mono" icon="success" onClose={() => toast.close(id)}>
                  <AlertIcon>
                    <CircleAlert />
                  </AlertIcon>
                  <AlertTitle>This is a success alert</AlertTitle>
                </Alert>
              ),
            },
          });
        }}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.add({
            data: {
              content: (
                <Alert close={true} variant="mono" icon="destructive" onClose={() => toast.close(id)}>
                  <AlertIcon>
                    <CircleAlert />
                  </AlertIcon>
                  <AlertTitle>This is a destructive alert</AlertTitle>
                </Alert>
              ),
            },
          });
        }}
      >
        Destructive
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.add({
            data: {
              content: (
                <Alert close={true} variant="mono" icon="warning" onClose={() => toast.close(id)}>
                  <AlertIcon>
                    <CircleAlert />
                  </AlertIcon>
                  <AlertTitle>This is a warning alert</AlertTitle>
                </Alert>
              ),
            },
          });
        }}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.add({
            data: {
              content: (
                <Alert close={true} variant="mono" icon="info" onClose={() => toast.close(id)}>
                  <AlertIcon>
                    <CircleAlert />
                  </AlertIcon>
                  <AlertTitle>This is a info alert</AlertTitle>
                </Alert>
              ),
            },
          });
        }}
      >
        Info
      </Button>
    </div>
  );
}
