'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/registry/default/ui/card';
import { Progress } from '@/registry/default/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/default/ui/select';

export default function StatisticCard6() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full md:w-[450px]">
        <CardHeader>
          <CardTitle>Tasks Overview</CardTitle>
          <CardToolbar>
            <Select defaultValue="this-month">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </CardToolbar>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* Progress bar and done tasks */}
          <div className="grow mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">Tasks Done</span>
              <span className="text-sm font-semibold text-success">12</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Task summary */}
          <div className="space-y-6">
            {/* Tasks list */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="flex flex-col items-center justify-center bg-muted/60 rounded-lg py-3.5 px-2 gap-1">
                <span className="text-lg font-bold text-green-500">28</span>
                <span className="text-xs text-accent-foreground">Backlog</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-muted/60 rounded-lg py-3.5 px-2 gap-1">
                <span className="text-lg font-bold text-yellow-500">14</span>
                <span className="text-xs text-accent-foreground">In Progress</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-muted/60 rounded-lg py-3.5 px-2 gap-1">
                <span className="text-lg font-bold text-violet-500">8</span>
                <span className="text-xs text-accent-foreground">In Review</span>
              </div>
            </div>

            {/* AI prediction footer */}
            <div className="text-xs text-muted-foreground text-center">
              AI prediction to finish all tasks: <span className="font-semibold text-foreground">1w 4d 2h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
