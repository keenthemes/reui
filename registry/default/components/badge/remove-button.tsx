import { Badge, BadgeButton } from '@/registry/default/ui/badge';
import { X } from 'lucide-react';

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Badge variant="primary" appearance="ghost">
          Ghost{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="primary">
          Solid{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="primary" appearance="outline">
          Outline{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="secondary" appearance="ghost">
          Ghost{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="secondary">
          Solid{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="secondary" appearance="outline">
          Outline{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="success" appearance="ghost">
          Ghost{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="success">
          Solid{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="success" appearance="outline">
          Outline{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="info" appearance="ghost">
          Ghost{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="info">
          Solid{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="info" appearance="outline">
          Outline{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="warning" appearance="ghost">
          Ghost{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="warning">
          Solid{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="warning" appearance="outline">
          Outline{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="destructive" appearance="ghost">
          Ghost{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="destructive">
          Solid{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="destructive" appearance="outline">
          Outline{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="mono" appearance="ghost">
          Ghost{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="mono">
          Solid{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
        <Badge variant="mono" appearance="outline">
          Outline{' '}
          <BadgeButton>
            <X />
          </BadgeButton>
        </Badge>
      </div>
    </div>
  );
}
