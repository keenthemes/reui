import { Badge } from '@/registry/default/ui/base-badge';
import { Button } from '@/registry/default/ui/base-button';
import { Bell, CircleCheckBig, MailCheck } from 'lucide-react';

export default function Component() {
  return (
    <div className="flex flex-col items-center gap-10">
      <Button variant="outline" mode="icon" className="relative">
        <Bell />
        <span className="border-2 border-background rounded-full size-3 bg-primary absolute -top-1 -end-1 animate-bounce" />
      </Button>

      <Button variant="outline" mode="icon" className="relative">
        <MailCheck />
        <Badge
          variant="primary"
          shape="circle"
          size="sm"
          className="absolute top-0 start-full -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2"
        >
          5
        </Badge>
      </Button>

      <Button variant="outline" className="relative">
        <MailCheck />
        Messages
        <Badge
          variant="destructive"
          shape="circle"
          size="sm"
          className="absolute top-0 start-full -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2"
        >
          5
        </Badge>
      </Button>

      <Button variant="outline">
        <CircleCheckBig />
        Notifications
        <Badge variant="primary" shape="circle" size="sm">
          10+
        </Badge>
      </Button>
    </div>
  );
}
