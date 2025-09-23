'use client';

import * as React from 'react';
import { Progress, ProgressValue } from '@/registry/default/ui/base-progress';

export default function BaseProgressVariants() {
  const [progress, setProgress] = React.useState(60);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(85), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-xs space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Default</h3>
        <Progress value={progress}>
          <ProgressValue />
        </Progress>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Green</h3>
        <Progress value={progress} className="[&_[data-slot=progress-indicator]]:bg-green-500">
          <ProgressValue />
        </Progress>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Yellow</h3>
        <Progress value={progress} className="[&_[data-slot=progress-indicator]]:bg-yellow-500">
          <ProgressValue />
        </Progress>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Destructive</h3>
        <Progress value={progress} className="[&_[data-slot=progress-indicator]]:bg-destructive">
          <ProgressValue />
        </Progress>
      </div>
    </div>
  );
}
