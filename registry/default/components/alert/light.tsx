import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import {
  Bell,
  CircleAlert,
  CircleCheck,
  MessageSquareWarning,
  ShieldAlert,
  TriangleAlert,
} from 'lucide-react';

export default function AlertDemo() {
  return (
    <div className="flex flex-col items-center w-full lg:max-w-[75%] gap-6">
      <Alert appearance="light" close={true}>
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertTitle>This is a default alert</AlertTitle>
      </Alert>

      <Alert variant="primary" appearance="light" close={true}>
        <AlertIcon>
          <MessageSquareWarning />
        </AlertIcon>
        <AlertTitle>This is a primary alert</AlertTitle>
      </Alert>

      <Alert variant="success" appearance="light" close={true}>
        <AlertIcon>
          <CircleCheck />
        </AlertIcon>
        <AlertTitle>This is a success alert</AlertTitle>
      </Alert>

      <Alert variant="destructive" appearance="light" close={true}>
        <AlertIcon>
          <TriangleAlert />
        </AlertIcon>
        <AlertTitle>This is a destructive alert</AlertTitle>
      </Alert>

      <Alert variant="info" appearance="light" close={true}>
        <AlertIcon>
          <Bell />
        </AlertIcon>
        <AlertTitle>This is an info alert</AlertTitle>
      </Alert>

      <Alert variant="warning" appearance="light" close={true}>
        <AlertIcon>
          <ShieldAlert />
        </AlertIcon>
        <AlertTitle>This is a warning alert</AlertTitle>
      </Alert>
    </div>
  );
}
