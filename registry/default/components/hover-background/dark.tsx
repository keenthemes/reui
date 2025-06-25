import { HoverBackground } from '@/registry/default/ui/hover-background';

export default function HoverBackgroundDark() {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <HoverBackground
        colors={{
          background: 'bg-gradient-to-br from-black via-gray-900 to-zinc-900',
          objects: [
            'bg-emerald-500/30',
            'bg-teal-500/30',
            'bg-green-500/30',
            'bg-lime-500/30',
            'bg-cyan-500/30',
            'bg-blue-500/30',
          ],
          glow: 'shadow-emerald-400/70',
        }}
        objectCount={8}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white/90">Dark Theme</h2>
            <p className="text-lg text-emerald-100/80 max-w-md">
              A sophisticated dark background with emerald and teal accents.
            </p>
          </div>
        </div>
      </HoverBackground>
    </div>
  );
}
