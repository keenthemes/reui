'use client';

import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiSpam3Fill,
} from '@remixicon/react';
import { toast } from 'sonner';

export default function SonnerDemo() {
  return (
    <div className="flex gap-6">
      <Button
        variant="outline"
        className="text-green-500"
        size="sm"
        onClick={() =>
          toast.custom(
            (t) => (
              <Alert
                variant="mono"
                icon="success"
                onClose={() => toast.dismiss(t)}
              >
                <AlertIcon>
                  <RiCheckboxCircleFill />
                </AlertIcon>
                <AlertTitle>This is a success toast</AlertTitle>
              </Alert>
            ),
            {
              duration: 5000,
            },
          )
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        className="text-violet-500"
        size="sm"
        onClick={() =>
          toast.custom(
            (t) => (
              <Alert
                variant="mono"
                icon="info"
                onClose={() => toast.dismiss(t)}
              >
                <AlertIcon>
                  <RiCheckboxCircleFill />
                </AlertIcon>
                <AlertTitle>This is an info toast</AlertTitle>
              </Alert>
            ),
            {
              duration: 5000,
            },
          )
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        className="text-yellow-500"
        size="sm"
        onClick={() =>
          toast.custom(
            (t) => (
              <Alert
                variant="mono"
                icon="warning"
                onClose={() => toast.dismiss(t)}
              >
                <AlertIcon>
                  <RiSpam3Fill />
                </AlertIcon>
                <AlertTitle>This is a warning toast</AlertTitle>
              </Alert>
            ),
            {
              duration: 5000,
            },
          )
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        className="text-destructive"
        size="sm"
        onClick={() =>
          toast.custom(
            (t) => (
              <Alert
                variant="mono"
                icon="destructive"
                onClose={() => toast.dismiss(t)}
              >
                <AlertIcon>
                  <RiErrorWarningFill />
                </AlertIcon>
                <AlertTitle>This is a destructive toast</AlertTitle>
              </Alert>
            ),
            {
              duration: 5000,
            },
          )
        }
      >
        Destructive
      </Button>
    </div>
  );
}
