import { TextReveal } from '@/registry/default/ui/text-reveal';

export default function Component() {
  return (
    <div>
      <TextReveal variant="wave" className="text-xl font-bold text-foreground py-12" staggerDelay={0.08}>
        Wave Animation
      </TextReveal>
    </div>
  );
}
