'use client';

import * as React from 'react';
import { Progress } from '@/registry/default/ui/base-progress';

export default function BaseProgressAnimated() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0; // Reset for continuous loop
        }
        return prev + Math.random() * 2 + 0.5; // Random increment 0.5-2.5
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full max-w-xs space-y-2">
      <h3 className="text-sm font-medium">Pulsing Animation</h3>
      <Progress
        value={progress}
        className="[&_[data-slot=progress-indicator]]:bg-purple-600 [&_[data-slot=progress-indicator]]:animate-pulse"
      ></Progress>
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        Processing data...
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
