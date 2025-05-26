import { Textarea } from '@/registry/default/ui/textarea';

export default function TextareaDemo() {
  return (
    <div className="w-full md:w-80 space-y-6">
      <Textarea placeholder="Small" variant="sm" />

      <Textarea placeholder="Medium" />

      <Textarea placeholder="Large" variant="lg" />
    </div>
  );
}
