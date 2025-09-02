'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardHeading, CardTitle, CardToolbar } from '@/registry/default/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/registry/default/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/registry/default/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip';
import { ChartNoAxesCombined, Info, TrendingUp } from 'lucide-react';
import { Area, AreaChart, XAxis } from 'recharts';

// Digital Marketing Impressions data for different periods (in thousands)
const impressionsData = {
  '5D': [
    { period: 'Mon', impressions: 145.2 },
    { period: 'Tue', impressions: 298.7 },
    { period: 'Wed', impressions: 356.4 },
    { period: 'Thu', impressions: 289.1 },
    { period: 'Fri', impressions: 412.8 },
  ],
  '2W': [
    { period: 'W1', impressions: 1245.5 },
    { period: 'W2', impressions: 1687.3 },
    { period: 'W3', impressions: 1354.9 },
    { period: 'W4', impressions: 1892.6 },
    { period: 'W5', impressions: 1456.2 },
    { period: 'W6', impressions: 2134.7 },
  ],
  '1M': [
    { period: 'W1', impressions: 3245.5 },
    { period: 'W2', impressions: 4187.3 },
    { period: 'W3', impressions: 3654.9 },
    { period: 'W4', impressions: 4892.6 },
    { period: 'W5', impressions: 4156.2 },
    { period: 'W6', impressions: 5234.7 },
    { period: 'W7', impressions: 4823.1 },
    { period: 'W8', impressions: 5567.4 },
  ],
  '6M': [
    { period: 'Jan', impressions: 18745.3 },
    { period: 'Feb', impressions: 22187.7 },
    { period: 'Mar', impressions: 19654.2 },
    { period: 'Apr', impressions: 25892.8 },
    { period: 'May', impressions: 23456.6 },
    { period: 'Jun', impressions: 27234.4 },
  ],
};

const chartConfig = {
  impressions: {
    label: 'Impressions',
    color: 'var(--color-violet-500)',
  },
} satisfies ChartConfig;

// Period configuration
const PERIODS = {
  '5D': { key: '5D', label: '5D' },
  '2W': { key: '2W', label: '2W' },
  '1M': { key: '1M', label: '1M' },
  '6M': { key: '6M', label: '6M' },
} as const;

type PeriodKey = keyof typeof PERIODS;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
        ${(value / 1000).toFixed(1)}M USD
      </div>
    );
  }
  return null;
};

export default function AreaChart3() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('5D');

  // Get data for selected period
  const currentData = impressionsData[selectedPeriod];

  // Calculate total impressions for the selected period
  const totalImpressions = currentData.reduce((sum, item) => sum + item.impressions, 0);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8">
      <div className="bg-muted/50 dark:bg-muted shadow-[0_0_4px_0_rgba(0,0,0,0.0.1)] backdrop-blur-xl border border-border/60 rounded-3xl p-2.5 w-full max-w-sm">
        <Card className="rounded-3xl bg-background border-border/50 p-5">
          <CardHeader className="min-h-auto flex-nowrap! p-0 border-b border-border pt-1 pb-6 mb-6">
            <CardHeading className="flex items-center gap-2.5 space-y-0">
              <div className="flex items-center justify-center size-10 rounded-full bg-muted/80">
                <ChartNoAxesCombined className="size-5" />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <CardTitle className="text-base font-semibold text-foreground leading-none">
                  Campaign Analytics
                </CardTitle>
                <p className="text-sm text-muted-foreground">Impressions and engagement</p>
              </div>
            </CardHeading>
            <CardToolbar>
              <Tooltip>
                <TooltipTrigger>
                  <span>
                    <Info className="size-4 fill-muted/60 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Campaign analytics by period</p>
                </TooltipContent>
              </Tooltip>
            </CardToolbar>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            {/* Period Selector */}
            <div className="space-y-6">
              {/* Main Metric */}
              <div className="space-y-1">
                <div className="text-3xl font-semibold text-foreground">
                  {totalImpressions >= 1000
                    ? `${(totalImpressions / 1000).toFixed(1)}M`
                    : `${totalImpressions.toFixed(0)}K`}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="size-4 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">+42%</span>
                  <span className="text-gray-600">compared to last {selectedPeriod === '5D' ? 'week' : 'period'}</span>
                </div>
              </div>

              {/* Toggle Group */}
              <ToggleGroup
                type="single"
                value={selectedPeriod}
                onValueChange={(value) => value && setSelectedPeriod(value as PeriodKey)}
                variant="outline"
                className="w-full shadow-none!"
              >
                {Object.values(PERIODS).map((period) => (
                  <ToggleGroupItem
                    key={period.key}
                    value={period.key}
                    className="flex-1 shadow-none data-[state=on]:bg-muted/60"
                  >
                    {period.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Chart */}
            <div className="h-40 w-full">
              <ChartContainer
                config={chartConfig}
                className="h-full w-full rounded-b-3xl overflow-hidden [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
              >
                <AreaChart
                  data={currentData}
                  margin={{
                    top: 10,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig.impressions.color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={chartConfig.impressions.color} stopOpacity={0.1} />
                    </linearGradient>

                    <filter id="activeDotShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow
                        dx="2"
                        dy="2"
                        stdDeviation="4"
                        floodColor={chartConfig.impressions.color}
                        floodOpacity="0.6"
                      />
                    </filter>
                  </defs>

                  <XAxis dataKey="period" hide />

                  <ChartTooltip
                    content={<CustomTooltip />}
                    cursor={{
                      strokeWidth: 1,
                      strokeDasharray: '2 2',
                      stroke: chartConfig.impressions.color,
                      strokeOpacity: 1,
                    }}
                  />

                  <Area
                    dataKey="impressions"
                    type="natural"
                    fill="url(#impressionsGradient)"
                    stroke={chartConfig.impressions.color}
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: chartConfig.impressions.color,
                      stroke: 'white',
                      strokeWidth: 2,
                      filter: 'url(#activeDotShadow)',
                    }}
                    activeDot={{
                      r: 6,
                      fill: chartConfig.impressions.color,
                      stroke: 'white',
                      strokeWidth: 2,
                      filter: 'url(#activeDotShadow)',
                    }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
