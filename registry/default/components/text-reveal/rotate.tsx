import { TextReveal } from '@/registry/default/ui/text-reveal';

export default function Component() {
  return (
    <TextReveal 
      variant="rotate" 
      className="text-xl font-bold text-foreground"
    >
      Rotate Animation
    </TextReveal>
  );
} 