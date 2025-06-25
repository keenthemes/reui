import { ShimmeringText } from '@/registry/default/ui/shimmering-text';

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <ShimmeringText
        text="Custom color"
        className="text-2xl font-bold"
        color="var(--color-primary)"
        shimmerColor="var(--color-white)"
        duration={1.5}
        repeatDelay={1}
      />
    </div>
  );
}
