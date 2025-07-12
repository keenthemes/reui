import Link from 'next/link';
import { Badge, BadgeDot } from '@/registry/default/ui/base-badge';

export default function BadgeDemo() {
  return (
    <div className="flex items-center gap-4">
      {/* Using asChild prop */}
      <Badge asChild appearance="light" shape="circle">
        <Link href="#">
          <BadgeDot className="bg-primary" />
          asChild
        </Link>
      </Badge>

      {/* Using render prop */}
      <Badge render={<Link href="#" />} appearance="light" shape="circle">
        <BadgeDot className="bg-primary" />
        Pender prop
      </Badge>
    </div>
  );
}
