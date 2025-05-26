import { Badge, BadgeDot } from '@/registry/default/ui/badge';

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <Badge appearance="ghost">
          <BadgeDot /> Ghost
        </Badge>
        <Badge>
          <BadgeDot /> Solid
        </Badge>
        <Badge appearance="outline">
          <BadgeDot /> Outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="primary" appearance="ghost">
          <BadgeDot /> Ghost
        </Badge>
        <Badge variant="primary">
          <BadgeDot /> Solid
        </Badge>
        <Badge variant="primary" appearance="outline">
          <BadgeDot /> Outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="success" appearance="ghost">
          <BadgeDot /> Ghost
        </Badge>
        <Badge variant="success">
          <BadgeDot /> Solid
        </Badge>
        <Badge variant="success" appearance="outline">
          <BadgeDot /> Outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="info" appearance="ghost">
          <BadgeDot /> Ghost
        </Badge>
        <Badge variant="info">
          <BadgeDot /> Solid
        </Badge>
        <Badge variant="info" appearance="outline">
          <BadgeDot /> Outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="warning" appearance="ghost">
          <BadgeDot /> Ghost
        </Badge>
        <Badge variant="warning">
          <BadgeDot /> Solid
        </Badge>
        <Badge variant="warning" appearance="outline">
          <BadgeDot /> Outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="destructive" appearance="ghost">
          <BadgeDot /> Ghost
        </Badge>
        <Badge variant="destructive">
          <BadgeDot /> Solid
        </Badge>
        <Badge variant="destructive" appearance="outline">
          <BadgeDot /> Outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="mono" appearance="ghost">
          <BadgeDot /> Ghost
        </Badge>
        <Badge variant="mono">
          <BadgeDot /> Solid
        </Badge>
        <Badge variant="mono" appearance="outline">
          <BadgeDot /> Outline
        </Badge>
      </div>
    </div>
  );
}
