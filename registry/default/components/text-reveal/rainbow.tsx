import { TextReveal } from '@/registry/default/ui/text-reveal';

export default function RainbowExample() {
  return (
    <div>
      <TextReveal
        variant="scale"
        className="text-xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text"
        staggerDelay={0.05}
      >
        Rainbow Gradient
      </TextReveal>
    </div>
  );
}
