import { GradientBackground } from '@/registry/default/ui/gradient-background';

export default function GradientBackgroundDark() {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <GradientBackground
        className="from-slate-900 via-purple-900 to-slate-950"
        transition={{ duration: 15, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
  );
}
