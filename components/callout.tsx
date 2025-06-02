import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { CircleAlert } from 'lucide-react';

export function Callout({ title, children }: React.ComponentProps<typeof Alert> & { icon?: string }) {
  return (
    <Alert variant="success" appearance="light" close={false}>
      <AlertIcon>
        <CircleAlert />
      </AlertIcon>
      <AlertContent>
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{children}</AlertDescription>
      </AlertContent>
    </Alert>
  );
}
