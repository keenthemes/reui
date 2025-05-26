import { Badge } from '@/registry/default/ui/badge';

export default function BadgeDemo() {
  return (
    <div className="flex items-center gap-4">
      <Badge variant="primary" appearance="outline">
        Primary
      </Badge>
      <Badge variant="secondary" appearance="outline">
        Secondary
      </Badge>
      <Badge variant="success" appearance="outline">
        Success
      </Badge>
      <Badge variant="warning" appearance="outline">
        Warining
      </Badge>
      <Badge variant="info" appearance="outline">
        Info
      </Badge>
      <Badge variant="destructive" appearance="outline">
        Destructive
      </Badge>
      <Badge variant="mono" appearance="outline">
        Mono
      </Badge>
    </div>
  );
}
