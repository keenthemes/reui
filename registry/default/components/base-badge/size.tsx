import { Badge } from '@/registry/default/ui/base-badge';

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-4">
        <Badge variant="primary" size="xs">
          Xsmall
        </Badge>
        <Badge variant="primary" size="sm">
          Small
        </Badge>
        <Badge variant="primary">Medium</Badge>
        <Badge variant="primary" size="lg">
          Large
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="primary" shape="circle" size="xs">
          5
        </Badge>
        <Badge variant="primary" shape="circle" size="sm">
          5
        </Badge>
        <Badge variant="primary" shape="circle">
          5
        </Badge>
        <Badge variant="primary" shape="circle" size="lg">
          5
        </Badge>
      </div>
    </div>
  );
} 