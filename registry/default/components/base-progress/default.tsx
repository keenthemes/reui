'use client';

import * as React from 'react';
import { Progress, ProgressValue } from '@/registry/default/ui/base-progress';

export default function BaseProgressDefault() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-xs">
      <Progress value={progress}>
        <ProgressValue />
      </Progress>
    </div>
  );
}
