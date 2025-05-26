import Link from 'next/link';
import { Separator } from '@/registry/default/ui/separator';

export default function SeparatorDemo() {
  return (
    <div className="text-foreground">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">ReUI</h4>
        <p className="text-sm text-muted-foreground">
          A free ReUI UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <Link
          href="https://reui.io"
          className="hover:text-primary hover:underline hover:underline-offset-2"
        >
          ReUI
        </Link>
        <Separator orientation="vertical" />
        <Link
          href="https://reui.io/docs"
          className="hover:text-primary hover:underline hover:underline-offset-2"
        >
          Docs
        </Link>
        <Separator orientation="vertical" />
        <Link
          href="https://github.com/keenthemes/reui"
          className="hover:text-primary hover:underline hover:underline-offset-2"
        >
          Source
        </Link>
      </div>
    </div>
  );
}
