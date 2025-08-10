import { TwinkleGrid } from '@/registry/default/ui/twinkle-grid';

export default function TwinkleGridDefault() {
  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg border bg-background">
      <TwinkleGrid
        className="relative inset-0 z-0"
        squareSize={6}
        gridGap={4}
        color="#808DB1"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={800}
        width={800}
      />
    </div>
  );
}