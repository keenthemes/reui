import { Button } from '@/registry/default/ui/base-button';

export default function Component() {
  return (
    <div className="flex items-center gap-2.5">
      <Button variant="ghost">Default</Button>
      <Button variant="primary" appearance="ghost">
        Primary
      </Button>
      <Button variant="destructive" appearance="ghost">
        Destructive
      </Button>
    </div>
  );
}
