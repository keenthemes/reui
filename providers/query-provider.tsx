'use client';

import { useState } from 'react';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { RiErrorWarningFill } from '@remixicon/react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            const message = error.message || 'Something went wrong. Please try again.';

            toast.custom(
              () => (
                <Alert variant="mono" icon="destructive" close={false}>
                  <AlertIcon>
                    <RiErrorWarningFill />
                  </AlertIcon>
                  <AlertTitle>{message}</AlertTitle>
                </Alert>
              ),
              {
                position: 'top-center',
              },
            );
          },
        }),
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export { QueryProvider };
