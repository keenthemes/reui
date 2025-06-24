import { GridBackground } from '@/registry/default/ui/grid-background';

export default function Component() {
  return (
    <div className="space-y-6">
      {/* Maximum Beams with Rainbow Colors */}
      <div className="relative h-80 w-full rounded-xl overflow-hidden">
        <GridBackground
          gridSize="10:10"
          colors={{
            background: 'bg-black',
            borderColor: 'border-white/10',
            borderSize: 'border',
            borderStyle: 'solid',
          }}
          beams={{
            count: 12,
            colors: [
              'bg-red-400',
              'bg-orange-400', 
              'bg-yellow-400',
              'bg-green-400',
              'bg-blue-400',
              'bg-indigo-400',
              'bg-purple-400',
              'bg-pink-400',
              'bg-cyan-400',
              'bg-emerald-400',
              'bg-violet-400',
              'bg-fuchsia-400',
            ],
            size: 'w-2 h-2',
            shadow: 'shadow-xl shadow-current/70',
            speed: 3,
          }}
        >
        </GridBackground>
      </div>

      {/* Minimal Beams with Large Size */}
      <div className="relative h-64 w-full rounded-xl overflow-hidden">
        <GridBackground
          gridSize="8:12"
          colors={{
            background: 'bg-slate-900',
            borderColor: 'border-blue-500/20',
            borderSize: 'border-2',
            borderStyle: 'solid',
          }}
          beams={{
            count: 3,
            colors: ['bg-blue-400', 'bg-sky-400', 'bg-cyan-400'],
            size: 'w-3 h-3',
            shadow: 'shadow-2xl shadow-blue-400/80',
            speed: 1.5,
          }}
        >
        </GridBackground>
      </div>
    </div>
  );
} 