import { Badge } from '@/registry/default/ui/base-badge';
import { Activity, Mail, Tag } from 'lucide-react';

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <Badge variant="primary" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="primary">
          <Mail /> Solid
        </Badge>
        <Badge variant="primary" appearance="light">
          <Activity /> light
        </Badge>
        <Badge variant="primary" appearance="outline">
          <Tag /> outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="success" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="success">
          <Mail /> Solid
        </Badge>
        <Badge variant="success" appearance="light">
          <Activity /> light
        </Badge>
        <Badge variant="success" appearance="outline">
          <Tag /> outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="info" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="info">
          <Mail /> Solid
        </Badge>
        <Badge variant="info" appearance="light">
          <Activity /> light
        </Badge>
        <Badge variant="info" appearance="outline">
          <Tag /> outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="warning" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="warning">
          <Mail /> Solid
        </Badge>
        <Badge variant="warning" appearance="light">
          <Activity /> light
        </Badge>
        <Badge variant="warning" appearance="outline">
          <Tag /> outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="destructive" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="destructive">
          <Mail /> Solid
        </Badge>
        <Badge variant="destructive" appearance="light">
          <Activity /> light
        </Badge>
        <Badge variant="destructive" appearance="outline">
          <Tag /> outline
        </Badge>
      </div>
    </div>
  );
}
