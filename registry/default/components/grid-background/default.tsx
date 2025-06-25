import { GridBackground } from '@/registry/default/ui/grid-background';

export default function Component() {
  return (
    <div className="relative h-96 w-full rounded-xl overflow-hidden">
      <GridBackground gridSize="6:6"></GridBackground>
    </div>
  );
}
