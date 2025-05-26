import { Button } from '@/registry/default/ui/button';

export default function ButtonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Button disabled>Primary</Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button mode="link" disabled>
        Link
      </Button>
    </div>
  );
}
