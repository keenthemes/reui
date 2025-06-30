import { Code } from '@/registry/default/ui/code';

export default function Component() {
  return (
    <div className="flex items-center flex-wrap gap-4">
      <Code variant="default">Default variant</Code>
      <Code variant="destructive">Destructive variant</Code>
      <Code variant="outline">Outline variant</Code>
    </div>
  );
}
