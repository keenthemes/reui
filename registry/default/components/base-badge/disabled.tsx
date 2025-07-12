import { Badge } from '@/registry/default/ui/base-badge';

export default function BadgeDemo() {
  return (
    <div className="flex items-center gap-4">
      <Badge variant="primary" appearance="ghost" disabled>
        Ghost
      </Badge>
      <Badge variant="primary" disabled>
        Solid
      </Badge>
      <Badge variant="primary" appearance="light" disabled>
        Light
      </Badge>
      <Badge variant="primary" appearance="outline" disabled>
        Outline
      </Badge>
    </div>
  );
}
