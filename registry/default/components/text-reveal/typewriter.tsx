import { TextReveal } from '@/registry/default/ui/text-reveal';

export default function TypewriterExample() {
  return (
    <div>
      <TextReveal variant="typewriter" className="text-xl font-bold text-foreground" staggerDelay={0.08}>
        Typewriter Effect
      </TextReveal>
    </div>
  );
}
