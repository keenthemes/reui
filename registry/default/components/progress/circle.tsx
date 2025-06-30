'use client';

import { useEffect, useState } from 'react';
import { ProgressCircle } from '@/registry/default/ui/progress';

export default function Completion() {
  const [cpuUsage, setCpuUsage] = useState(0);

  useEffect(() => {
    // CPU usage simulation
    const cpuTimer = setInterval(() => {
      setCpuUsage((prev) => {
        const target = 30 + Math.sin(Date.now() / 3000) * 20 + Math.random() * 15;
        return prev + (target - prev) * 0.1;
      });
    }, 100);

    return () => {
      clearInterval(cpuTimer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <ProgressCircle
          value={cpuUsage}
          size={80}
          strokeWidth={6}
          className="text-fuchsia-500"
          indicatorClassName="text-fuchsia-500"
        >
          <div className="text-center">
            <div className="text-base font-bold">{Math.round(cpuUsage)}%</div>
            <div className="text-xs text-muted-foreground">CPU</div>
          </div>
        </ProgressCircle>
        <span className="text-xs text-muted-foreground">Processor Usage</span>
      </div>
    </div>
  );
}
