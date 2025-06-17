import { Badge } from '@/registry/default/ui/badge';

export default function Component() {
  return (
    <div className="flex items-center gap-4">
      <Badge>Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  );
}
