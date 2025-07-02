import { Input } from '@/registry/default/ui/base-input';

export default function InputDemo() {
  return (
    <div className="w-80 space-y-6">
      <Input type="text" variant="sm" placeholder="Small" />

      <Input type="text" placeholder="Medium" />

      <Input type="text" variant="lg" placeholder="Large" />
    </div>
  );
}
