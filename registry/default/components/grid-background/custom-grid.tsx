import { GridBackground } from '@/registry/default/ui/grid-background';

export default function Component() {
  return (
    <div className="space-y-6">
      {/* 6x8 Grid with Dashed Borders */}
      <div className="relative h-64 w-full rounded-xl overflow-hidden">
        <GridBackground
          gridSize="6:8"
          colors={{
            background: 'bg-indigo-950',
            borderColor: 'border-indigo-400/30',
            borderSize: 'border-2',
            borderStyle: 'dashed',
          }}
          beams={{
            count: 4,
            colors: ['bg-indigo-400', 'bg-purple-400'],
            speed: 2,
          }}
        >
        </GridBackground>
      </div>

      {/* 12x16 Grid with Dotted Borders */}
      <div className="relative h-64 w-full rounded-xl overflow-hidden">
        <GridBackground
          gridSize="12:16"
          colors={{
            background: 'bg-emerald-950',
            borderColor: 'border-emerald-400/20',
            borderSize: 'border',
            borderStyle: 'dotted',
          }}
          beams={{
            count: 8,
            colors: ['bg-emerald-400', 'bg-teal-400', 'bg-cyan-400'],
            speed: 4,
            shadow: 'shadow-lg shadow-emerald-400/50',
          }}
        >
        </GridBackground>
      </div>
    </div>
  );
} 