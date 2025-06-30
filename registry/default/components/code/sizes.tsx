import { Code } from '@/registry/default/ui/code';

export default function Component() {
  return (
    <div className="flex items-center flex-wrap gap-4">
      <Code size="sm">Small size</Code>
      <Code size="default">Default size</Code>
      <Code size="lg">Large size</Code>
    </div>
  );
}
