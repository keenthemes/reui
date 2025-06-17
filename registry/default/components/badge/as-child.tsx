import Link from 'next/link';
import { Badge, BadgeDot } from '@/registry/default/ui/badge';

export default function BadgeDemo() {
  return (
    <Badge asChild appearance="light" shape="circle">
      <Link href="#">
        <BadgeDot className="bg-primary" />
        Badge
      </Link>
    </Badge>
  );
}
