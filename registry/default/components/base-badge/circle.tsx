import { Badge } from '@/registry/default/ui/base-badge';

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Badge variant="primary" shape="circle">
          Primary
        </Badge>
        <Badge variant="success" shape="circle">
          Success
        </Badge>
        <Badge variant="warning" shape="circle">
          Warning
        </Badge>
        <Badge variant="info" shape="circle">
          Info
        </Badge>
        <Badge variant="destructive" shape="circle">
          Destructive
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="primary" appearance="light" shape="circle">
          Primary
        </Badge>
        <Badge variant="success" appearance="light" shape="circle">
          Success
        </Badge>
        <Badge variant="warning" appearance="light" shape="circle">
          Warning
        </Badge>
        <Badge variant="info" appearance="light" shape="circle">
          Info
        </Badge>
        <Badge variant="destructive" appearance="light" shape="circle">
          Destructive
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="primary" appearance="outline" shape="circle">
          Primary
        </Badge>
        <Badge variant="success" appearance="outline" shape="circle">
          Success
        </Badge>
        <Badge variant="warning" appearance="outline" shape="circle">
          Warning
        </Badge>
        <Badge variant="info" appearance="outline" shape="circle">
          Info
        </Badge>
        <Badge variant="destructive" appearance="outline" shape="circle">
          Destructive
        </Badge>
      </div>
    </div>
  );
}
