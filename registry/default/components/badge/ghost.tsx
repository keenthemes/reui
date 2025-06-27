import { Badge } from '@/registry/default/ui/badge';

export default function BadgeDemo() {
  return (
    <div className="flex items-center gap-4">
      <Badge variant="primary" appearance="ghost">
        Primary
      </Badge>
      <Badge variant="secondary" appearance="ghost">
        Secondary
      </Badge>
      <Badge variant="success" appearance="ghost">
        Success
      </Badge>
      <Badge variant="warning" appearance="ghost">
        Warning
      </Badge>
      <Badge variant="info" appearance="ghost">
        Info
      </Badge>
      <Badge variant="destructive" appearance="ghost">
        Destructive
      </Badge>
    </div>
  );
}
