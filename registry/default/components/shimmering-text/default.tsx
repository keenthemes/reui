import { ShimmeringText } from '@/registry/default/ui/shimmering-text';

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <ShimmeringText
        text="Shimmering Text"
        className="text-2xl font-bold"
        duration={1.5}
        repeatDelay={1}
      />
    </div>
  );
} 