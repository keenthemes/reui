import { Badge } from '@/registry/default/ui/badge';

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Badge variant="primary" shape="circle">
          Primary
        </Badge>
        <Badge variant="secondary" shape="circle">
          Secondary
        </Badge>
        <Badge variant="success" shape="circle">
          Success
        </Badge>
        <Badge variant="warning" shape="circle">
          Warining
        </Badge>
        <Badge variant="info" shape="circle">
          Info
        </Badge>
        <Badge variant="destructive" shape="circle">
          Destructive
        </Badge>
        <Badge variant="mono" shape="circle">
          Mono
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="primary" appearance="outline" shape="circle">
          Primary
        </Badge>
        <Badge variant="secondary" appearance="outline" shape="circle">
          Secondary
        </Badge>
        <Badge variant="success" appearance="outline" shape="circle">
          Success
        </Badge>
        <Badge variant="warning" appearance="outline" shape="circle">
          Warining
        </Badge>
        <Badge variant="info" appearance="outline" shape="circle">
          Info
        </Badge>
        <Badge variant="destructive" appearance="outline" shape="circle">
          Destructive
        </Badge>
        <Badge variant="mono" appearance="outline" shape="circle">
          Mono
        </Badge>
      </div>
    </div>
  );
}
