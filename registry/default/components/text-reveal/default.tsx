import { TextReveal } from '@/registry/default/ui/text-reveal';

export default function Component() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <TextReveal variant="fade" className="text-xl font-bold text-foreground">
        Beautiful Text Reveal Animation
      </TextReveal>
    </div>
  );
}
