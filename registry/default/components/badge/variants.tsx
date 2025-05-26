import { Badge } from '@/registry/default/ui/badge';

export default function BadgeDemo() {
  return (
    <div className="flex items-center gap-4">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warining</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="mono">Mono</Badge>
    </div>
  );
}
