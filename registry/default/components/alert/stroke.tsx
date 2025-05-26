import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import {
  RiAlertFill,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiNotificationFill,
  RiSpam3Fill,
  RiSpamFill,
} from '@remixicon/react';

export default function AlertDemo() {
  return (
    <div className="flex flex-col items-center w-full lg:max-w-[75%] gap-6">
      <Alert appearance="stroke">
        <AlertIcon>
          <RiAlertFill />
        </AlertIcon>
        <AlertTitle>This is a default alert</AlertTitle>
      </Alert>

      <Alert variant="primary" appearance="stroke">
        <AlertIcon>
          <RiNotificationFill />
        </AlertIcon>
        <AlertTitle>This is a primary alert</AlertTitle>
      </Alert>

      <Alert variant="success" appearance="stroke">
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>This is a success alert</AlertTitle>
      </Alert>

      <Alert variant="destructive" appearance="stroke">
        <AlertIcon>
          <RiErrorWarningFill />
        </AlertIcon>
        <AlertTitle>This is a destructive alert</AlertTitle>
      </Alert>

      <Alert variant="info" appearance="stroke">
        <AlertIcon>
          <RiSpamFill />
        </AlertIcon>
        <AlertTitle>This is an info alert</AlertTitle>
      </Alert>

      <Alert variant="warning" appearance="stroke">
        <AlertIcon>
          <RiSpam3Fill />
        </AlertIcon>
        <AlertTitle>This is a warning alert</AlertTitle>
      </Alert>
    </div>
  );
}
