import { Badge, BadgeDot } from '@/registry/default/ui/base-badge';

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <Badge appearance="ghost">
          <BadgeDot /> Ghost
        </Badge>
        <Badge>
          <BadgeDot /> Default
        </Badge>
        <Badge appearance="light">
          <BadgeDot /> Light
        </Badge>
        <Badge appearance="outline">
          <BadgeDot /> Outline
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="success" appearance="ghost">
          <BadgeDot /> Ghost
        </Badge>
        <Badge variant="success">
          <BadgeDot /> Default
        </Badge>
        <Badge variant="success" appearance="light">
          <BadgeDot /> Light
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
          <BadgeDot /> Default
        </Badge>
        <Badge variant="info" appearance="light">
          <BadgeDot /> Light
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
          <BadgeDot /> Default
        </Badge>
        <Badge variant="warning" appearance="light">
          <BadgeDot /> Light
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
          <BadgeDot /> Default
        </Badge>
        <Badge variant="destructive" appearance="light">
          <BadgeDot /> Light
        </Badge>
        <Badge variant="destructive" appearance="outline">
          <BadgeDot /> Outline
        </Badge>
      </div>
    </div>
  );
}
