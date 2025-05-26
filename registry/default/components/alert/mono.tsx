import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertToolbar,
} from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiNotificationFill,
  RiSpam3Fill,
  RiSpamFill,
} from '@remixicon/react';

export default function AlertDemo() {
  return (
    <div className="flex flex-col items-center w-full lg:max-w-[75%] gap-6">
      <Alert variant="mono" icon="primary" close={true}>
        <AlertIcon>
          <RiNotificationFill />
        </AlertIcon>
        <AlertTitle>This is a primary alert</AlertTitle>
        <AlertToolbar>
          <Button
            variant="inverse"
            mode="link"
            underlined="solid"
            size="sm"
            className="flex mt-0.5"
          >
            Upgrade
          </Button>
        </AlertToolbar>
      </Alert>

      <Alert variant="mono" icon="success" close={true}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>This is a success alert</AlertTitle>
        <AlertToolbar>
          <Button
            variant="inverse"
            mode="link"
            underlined="solid"
            size="sm"
            className="flex mt-0.5"
          >
            Upgrade
          </Button>
        </AlertToolbar>
      </Alert>

      <Alert variant="mono" icon="destructive" close={true}>
        <AlertIcon>
          <RiErrorWarningFill />
        </AlertIcon>
        <AlertTitle>This is a destructive alert</AlertTitle>
        <AlertToolbar>
          <Button
            variant="inverse"
            mode="link"
            underlined="solid"
            size="sm"
            className="flex mt-0.5"
          >
            Upgrade
          </Button>
        </AlertToolbar>
      </Alert>

      <Alert variant="mono" icon="info" close={true}>
        <AlertIcon>
          <RiSpamFill />
        </AlertIcon>
        <AlertTitle>This is an info alert</AlertTitle>
        <AlertToolbar>
          <Button
            variant="inverse"
            mode="link"
            underlined="solid"
            size="sm"
            className="flex mt-0.5"
          >
            Upgrade
          </Button>
        </AlertToolbar>
      </Alert>

      <Alert variant="mono" icon="warning" close={true}>
        <AlertIcon>
          <RiSpam3Fill />
        </AlertIcon>
        <AlertTitle>This is a warning alert</AlertTitle>
        <AlertToolbar>
          <Button
            variant="inverse"
            mode="link"
            underlined="solid"
            size="sm"
            className="flex mt-0.5"
          >
            Upgrade
          </Button>
        </AlertToolbar>
      </Alert>
    </div>
  );
}
