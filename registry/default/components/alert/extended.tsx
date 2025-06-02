import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { RiAlertFill } from '@remixicon/react';

export default function AlertDemo() {
  return (
    <div className="flex flex-col items-center w-full lg:max-w-[75%] gap-6">
      <Alert variant="primary" close={true}>
        <AlertIcon>
          <RiAlertFill />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Example Alert Title</AlertTitle>
          <AlertDescription>
            Insert the alert description here. It would look better as two lines of text.
          </AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="destructive" appearance="light" close={true}>
        <AlertIcon>
          <RiAlertFill />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Example Alert Title</AlertTitle>
          <AlertDescription>
            Insert the alert description here. It would look better as two lines of text.
          </AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  );
}
