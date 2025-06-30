'use client';

import { ProgressCircle } from '@/registry/default/ui/progress';

export default function ProgressSpinnerDemo() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <ProgressCircle value={25} size={32} strokeWidth={3} className="text-blue-500 animate-spin" />
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}
