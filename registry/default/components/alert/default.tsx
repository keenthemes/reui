import { Alert, AlertIcon, AlertTitle, AlertToolbar } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';
import {
  RiNotificationFill,
} from '@remixicon/react';

export default function Component() {
  return (
    <div className="flex flex-col items-center w-full lg:max-w-[75%] gap-6">
      <Alert close={true}>
        <AlertIcon>
          <RiNotificationFill />
        </AlertIcon>
        <AlertTitle>This is a primary alert</AlertTitle>
        <AlertToolbar>
          <Button variant="inverse" mode="link" underlined="solid" size="sm" className="flex mt-0.5">
            Upgrade
          </Button>
        </AlertToolbar>
      </Alert>
    </div>
  );
}
