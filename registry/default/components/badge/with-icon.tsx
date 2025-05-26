import { Badge } from '@/registry/default/ui/badge';
import { Activity, Check, Mail, Tag } from 'lucide-react';

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <Badge appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge>
          <Mail /> Solid
        </Badge>
        <Badge appearance="outline">
          <Activity /> Outline
        </Badge>
        <Badge appearance="stroke">
          <Check /> Stroke
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="primary" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="primary">
          <Mail /> Solid
        </Badge>
        <Badge variant="primary" appearance="outline">
          <Activity /> Outline
        </Badge>
        <Badge appearance="stroke">
          <Check className="text-primary" /> Stroke
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="success" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="success">
          <Mail /> Solid
        </Badge>
        <Badge variant="success" appearance="outline">
          <Activity /> Outline
        </Badge>
        <Badge appearance="stroke">
          <Check className="text-success" /> Stroke
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="info" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="info">
          <Mail /> Solid
        </Badge>
        <Badge variant="info" appearance="outline">
          <Activity /> Outline
        </Badge>
        <Badge appearance="stroke">
          <Check className="text-info" /> Stroke
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="warning" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="warning">
          <Mail /> Solid
        </Badge>
        <Badge variant="warning" appearance="outline">
          <Activity /> Outline
        </Badge>
        <Badge appearance="stroke">
          <Check className="text-warning" /> Stroke
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="destructive" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="destructive">
          <Mail /> Solid
        </Badge>
        <Badge variant="destructive" appearance="outline">
          <Activity /> Outline
        </Badge>
        <Badge appearance="stroke">
          <Check className="text-destructive" /> Stroke
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="mono" appearance="ghost">
          <Tag /> Ghost
        </Badge>
        <Badge variant="mono">
          <Mail /> Solid
        </Badge>
        <Badge variant="mono" appearance="outline">
          <Activity /> Outline
        </Badge>
      </div>
    </div>
  );
}
