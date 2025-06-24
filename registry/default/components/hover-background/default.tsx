import { HoverBackground } from '@/registry/default/ui/hover-background';

export default function HoverBackgroundDefault() {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <HoverBackground>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white/90">
              Hover Me!
            </h2>
            <p className="text-lg text-white/70 max-w-md">
              Watch the animated objects come to life when you hover over this area.
            </p>
          </div>
        </div>
      </HoverBackground>
    </div>
  );
} 