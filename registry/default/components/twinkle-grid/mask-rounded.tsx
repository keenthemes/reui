import { TwinkleGrid } from '@/registry/default/ui/twinkle-grid';

export default function TwinkleGridMaskRounded() {
  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg border bg-background">
      <TwinkleGrid
        className="relative inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        squareSize={6}
        gridGap={4}
        color="#60A5FA"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={800}
        width={800}
      />
    </div>
  );
}
