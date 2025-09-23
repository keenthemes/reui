'use client';

import { useToast } from '@/registry/default/hooks/use-toast';
import { Button } from '@/registry/default/ui/base-button';

export default function ToastTypeDemo() {
  const toast = useToast();

  return (
    <div className="items-center gap-2 grid grid-cols-3">
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            title: 'Default',
            description: 'This is a default toast',
            type: 'default',
          });
        }}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            title: 'Loading',
            description: 'This is a loading toast',
            type: 'loading',
          });
        }}
      >
        Loading
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            title: 'Success',
            description: 'This is a success toast',
            type: 'success',
          });
        }}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            title: 'Error',
            description: 'This is a error toast',
            type: 'error',
          });
        }}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            title: 'Info',
            description: 'This is a info toast',
            type: 'info',
          });
        }}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            title: 'Warning',
            description: 'This is a warning toast',
            type: 'warning',
          });
        }}
      >
        Warning
      </Button>
    </div>
  );
}
