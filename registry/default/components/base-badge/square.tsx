import { Badge } from '@/registry/default/ui/base-badge';

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Badge variant="primary" shape="circle">
          5
        </Badge>
        <Badge variant="secondary" shape="circle">
          5
        </Badge>
        <Badge variant="success" shape="circle">
          5
        </Badge>
        <Badge variant="warning" shape="circle">
          5
        </Badge>
        <Badge variant="info" shape="circle">
          5
        </Badge>
        <Badge variant="destructive" shape="circle">
          5
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="primary" appearance="light" shape="circle">
          9
        </Badge>
        <Badge variant="secondary" appearance="light" shape="circle">
          9
        </Badge>
        <Badge variant="success" appearance="light" shape="circle">
          9
        </Badge>
        <Badge variant="warning" appearance="light" shape="circle">
          9
        </Badge>
        <Badge variant="info" appearance="light" shape="circle">
          9
        </Badge>
        <Badge variant="destructive" appearance="light" shape="circle">
          9
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="primary" appearance="outline" shape="circle">
          5
        </Badge>
        <Badge variant="secondary" appearance="outline" shape="circle">
          5
        </Badge>
        <Badge variant="success" appearance="outline" shape="circle">
          5
        </Badge>
        <Badge variant="warning" appearance="outline" shape="circle">
          5
        </Badge>
        <Badge variant="info" appearance="outline" shape="circle">
          5
        </Badge>
        <Badge variant="destructive" appearance="outline" shape="circle">
          5
        </Badge>
      </div>
    </div>
  );
} 