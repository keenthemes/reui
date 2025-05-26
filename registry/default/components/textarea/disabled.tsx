import { Textarea } from '@/registry/default/ui/textarea';

export default function TextareaDemo() {
  return (
    <div className="w-96">
      <Textarea placeholder="Type your message here." disabled />
    </div>
  );
}
