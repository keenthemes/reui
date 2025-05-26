import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { RiAlertFill } from '@remixicon/react';

export default function AlertDemo() {
  return (
    <div className="flex flex-col items-center w-full lg:max-w-[75%] gap-6">
      <Alert variant="warning" appearance="stroke" size="sm" close={true}>
        <AlertIcon>
          <RiAlertFill />
        </AlertIcon>
        <AlertTitle>This is a small size alert</AlertTitle>
      </Alert>
      <Alert variant="warning" appearance="stroke" close={true}>
        <AlertIcon>
          <RiAlertFill />
        </AlertIcon>
        <AlertTitle>This is a medium size alert</AlertTitle>
      </Alert>
      <Alert variant="warning" appearance="stroke" size="lg" close={true}>
        <AlertIcon>
          <RiAlertFill />
        </AlertIcon>
        <AlertTitle>This is a large size alert</AlertTitle>
      </Alert>
    </div>
  );
}
