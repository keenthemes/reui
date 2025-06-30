'use client';

import * as React from 'react';
import { Progress } from '@/registry/default/ui/progress';

export default function Component() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-md">
      <Progress value={progress} />
    </div>
  );
}
