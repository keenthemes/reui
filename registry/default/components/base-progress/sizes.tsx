'use client';

import * as React from 'react';
import { Progress, ProgressValue } from '@/registry/default/ui/base-progress';

export default function BaseProgressSizes() {
  const [progress, setProgress] = React.useState(45);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(75), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-xs space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Small</h3>
        <Progress value={progress} className="h-1">
          <ProgressValue />
        </Progress>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Medium (Default)</h3>
        <Progress value={progress}>
          <ProgressValue />
        </Progress>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Large</h3>
        <Progress value={progress} className="h-3">
          <ProgressValue />
        </Progress>
      </div>
    </div>
  );
}
