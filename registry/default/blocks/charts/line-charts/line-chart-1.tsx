'use client';

import React from 'react';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/registry/default/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/registry/default/ui/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { ArrowDown, ArrowUp, Calendar, Download, Filter, MoreHorizontal, RefreshCw, Share2 } from 'lucide-react';
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from 'recharts';

// Sales data for B2B Software Company (6 months)
const salesData = [
  { month: 'Jan 24', goals: 250000, sales: 280000, salesArea: 280000 },
  { month: 'Feb 24', goals: 420000, sales: 350000, salesArea: 350000 },
  { month: 'Mar 24', goals: 380000, sales: 480000, salesArea: 480000 },
  { month: 'Apr 24', goals: 520000, sales: 390000, salesArea: 390000 },
  { month: 'May 24', goals: 300000, sales: 520000, salesArea: 520000 },
  { month: 'Jun 24', goals: 550000, sales: 465000, salesArea: 465000 },
];

// Use custom or Tailwind standard colors: https://tailwindcss.com/docs/colors
const chartConfig = {
  goals: {
    label: 'Goals',
    color: 'var(--color-pink-500)',
  },
  sales: {
    label: 'Sales',
    color: 'var(--color-teal-500)',
  },
} satisfies ChartConfig;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const ChartLabel = ({ label, color = chartConfig.sales.color }: { label: string; color: string }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-3.5 border-4 rounded-full bg-background" style={{ borderColor: color }}></div>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    // Filter out salesArea from tooltip
    const filteredPayload = payload.filter((entry) => entry.dataKey !== 'salesArea');

    return (
      <div className="rounded-lg border bg-popover p-3 shadow-sm shadow-black/5 min-w-[180px]">
        <div className="text-xs font-medium text-muted-foreground tracking-wide mb-2.5">{label}</div>
        <div className="space-y-2">
          {filteredPayload.map((entry, index) => {
            const config = chartConfig[entry.dataKey as keyof typeof chartConfig];
            return (
              <div key={index} className="flex items-center gap-2 text-xs">
                <ChartLabel label={config?.label + ':'} color={entry.color} />
                <span className="font-semibold text-popover-foreground">${(entry.value / 1000000).toFixed(1)}M</span>
                {config?.label == 'Goals' && (
                  <Badge
                    variant={
                      ((entry.value - filteredPayload[0].value) / filteredPayload[0].value) * 100 > 0
                        ? 'success'
                        : 'destructive'
                    }
                    appearance="light"
                    className="text-xs flex items-center gap-1"
                  >
                    {((entry.value - filteredPayload[0].value) / filteredPayload[0].value) * 100 > 0 ? (
                      <ArrowUp className="size-3" />
                    ) : (
                      <ArrowDown className="size-3" />
                    )}
                    {Math.abs(((entry.value - filteredPayload[0].value) / filteredPayload[0].value) * 100).toFixed(0)}%
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function LineChart1() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full lg:max-w-4xl">
        <CardHeader className="border-0 min-h-auto pt-6 pb-6">
          <CardTitle className="text-base font-semibold">Sales Overview</CardTitle>
          <CardToolbar>
            <div className="flex items-center gap-4 text-sm">
              <ChartLabel label="Sales" color={chartConfig.sales.color} />
              <ChartLabel label="Goals" color={chartConfig.goals.color} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="dim" size="sm" mode="icon" className="-me-1.5">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                <DropdownMenuItem>
                  <Download className="size-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="size-4" />
                  Change Period
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Filter className="size-4" />
                  Filter Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw className="size-4" />
                  Refresh
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Share2 className="size-4" />
                  Share Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardToolbar>
        </CardHeader>

        <CardContent className="px-2.5 flex flex-col items-end">
          <ChartContainer
            config={chartConfig}
            className="h-[350px] w-full [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
          >
            <ComposedChart
              data={salesData}
              margin={{
                top: 5,
                right: 15,
                left: 5,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartConfig.sales.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartConfig.sales.color} stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="var(--input)"
                strokeOpacity={1}
                horizontal={true}
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, className: 'text-muted-foreground' }}
                dy={5}
                tickMargin={12}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, className: 'text-muted-foreground' }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                domain={['dataMin - 50000', 'dataMax + 50000']}
                tickMargin={12}
              />

              {/* Current month reference line */}
              <ReferenceLine x="Mar 24" stroke={chartConfig.sales.color} strokeWidth={1} />

              {/* Tooltip */}
              <ChartTooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: 'var(--input)',
                  strokeWidth: 1,
                  strokeDasharray: 'none',
                }}
              />

              {/* Sales area with gradient background */}
              <Area
                type="linear"
                dataKey="salesArea"
                stroke="transparent"
                fill="url(#salesGradient)"
                strokeWidth={0}
                dot={false}
              />

              {/* Sales line with dots */}
              <Line
                type="linear"
                dataKey="sales"
                stroke={chartConfig.sales.color}
                strokeWidth={2}
                dot={{
                  fill: 'var(--background)',
                  strokeWidth: 2,
                  r: 6,
                  stroke: chartConfig.sales.color,
                }}
              />

              {/* Goals line (dashed) */}
              <Line
                type="linear"
                dataKey="goals"
                stroke={chartConfig.goals.color}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{
                  fill: 'var(--background)',
                  strokeWidth: 2,
                  r: 6,
                  stroke: chartConfig.goals.color,
                  strokeDasharray: '0',
                }}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
