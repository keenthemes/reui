import { Badge } from '@/registry/default/ui/badge';

export default function BadgeDemo() {
  return (
    <div className="flex items-center gap-4">
      <Badge variant="primary" appearance="light">
        Primary
      </Badge>
      <Badge variant="success" appearance="light">
        Success
      </Badge>
      <Badge variant="warning" appearance="light">
        Warning
      </Badge>
      <Badge variant="info" appearance="light">
        Info
      </Badge>
      <Badge variant="destructive" appearance="light">
        Destructive
      </Badge>
    </div>
  );
}
