import { TextReveal } from '@/registry/default/ui/text-reveal';

export default function SlideVariantsExample() {
  return (
    <div className="py-12 space-y-8">
      <div>
        <TextReveal
          variant="slideUp"
          className="text-xl font-bold text-foreground"
          staggerDelay={0.06}
          delay={0}
          startOnView={false}
        >
          Slide Up Animation
        </TextReveal>
      </div>

      <div>
        <TextReveal
          variant="slideDown"
          className="text-xl font-bold text-foreground"
          staggerDelay={0.04}
          delay={1.5}
          startOnView={false}
        >
          Slide Down Animation
        </TextReveal>
      </div>

      <div>
        <TextReveal
          variant="slideLeft"
          className="text-xl font-bold text-foreground"
          staggerDelay={0.05}
          delay={3}
          startOnView={false}
        >
          Slide Left Animation
        </TextReveal>
      </div>

      <div>
        <TextReveal
          variant="slideRight"
          className="text-xl font-bold text-foreground"
          staggerDelay={0.05}
          delay={4.5}
          startOnView={false}
        >
          Slide Right Animation
        </TextReveal>
      </div>
    </div>
  );
}
