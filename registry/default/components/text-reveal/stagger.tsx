import { TextReveal } from '@/registry/default/ui/text-reveal';

export default function StaggerExample() {
  return (
    <div>
      <TextReveal variant="stagger" className="text-xl font-bold text-foreground py-12" staggerDelay={0.05}>
        Stagger Animation
      </TextReveal>
    </div>
  );
}
