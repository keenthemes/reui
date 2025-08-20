'use client';

import { useEffect, useState } from 'react';
import { ProgressRadial } from '@/registry/default/ui/progress';

export default function ProgressRadialDemo() {
  const [taskProgress, setTaskProgress] = useState<number>(0);

  useEffect(() => {
    // Task completion simulation
    const taskTimer = setInterval(() => {
      setTaskProgress((prev) => {
        if (prev >= 100) {
          return 0; // Reset for continuous loop
        }
        return prev + Math.random() * 2 + 0.5; // Random increment 0.5-2.5
      });
    }, 200);

    return () => {
      clearInterval(taskTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <ProgressRadial
        value={taskProgress}
        size={80}
        startAngle={-90}
        endAngle={180}
        strokeWidth={5}
        indicatorClassName="text-green-500"
        className="text-green-500"
      >
        <div className="text-center">
          <div className="text-base font-bold">{Math.round(taskProgress)}%</div>
          <div className="text-xs text-muted-foreground">Upload</div>
        </div>
      </ProgressRadial>
      <span className="text-xs text-muted-foreground">Upload Status</span>
    </div>
  );
}
