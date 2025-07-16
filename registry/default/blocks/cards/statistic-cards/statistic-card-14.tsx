'use client';

import * as React from 'react';
import { Badge } from '@/registry/default/ui/badge';
import { Card, CardContent } from '@/registry/default/ui/card';
import { ArrowUpRight, Minus, Minus as MinusIcon } from 'lucide-react';

const bars = [6, 6, 5, 5, 4, 4, 3, 0];
const maxBars = Math.max(...bars);

const barInsights = [
  {
    date: '2024-06-01',
    growth: 8.2,
    direction: 'up',
    note: 'Feature launch week. Strong adoption spike.',
  },
  {
    date: '2024-06-08',
    growth: 7.5,
    direction: 'up',
    note: 'Onboarding improvements led to a 7.5% boost in adoption.',
  },
  {
    date: '2024-06-15',
    growth: 2.1,
    direction: 'up',
    note: 'Steady growth as more teams enabled the feature.',
  },
  {
    date: '2024-06-22',
    growth: 0.0,
    direction: 'neutral',
    note: 'Temporary plateau after a minor bug was reported.',
  },
  {
    date: '2024-06-29',
    growth: 0.0,
    direction: 'neutral',
    note: 'Seasonal dip, many users on vacation.',
  },
  {
    date: '2024-07-06',
    growth: 0.0,
    direction: 'neutral',
    note: 'No significant change, awaiting next release.',
  },
  {
    date: '2024-07-13',
    growth: 1.4,
    direction: 'up',
    note: 'Beta feature feedback positive, slight increase.',
  },
  {
    date: '2024-07-20',
    growth: 0.0,
    direction: 'neutral',
    note: 'Stable week, engagement holding steady.',
  },
];

function GrowthBadge({ direction, growth }: { direction: string; growth: number }) {
  if (direction === 'up')
    return (
      <Badge className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
        <ArrowUpRight className="w-3 h-3" />+{growth}%
      </Badge>
    );
  return (
    <Badge className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
      <MinusIcon className="w-3 h-3" />
      {growth}%
    </Badge>
  );
}

function getBarColor(direction: string, j: number, height: number) {
  if (height === 0) return 'bg-muted';
  if (direction === 'up') {
    const barColors = ['bg-indigo-500', 'bg-indigo-400', 'bg-indigo-300', 'bg-indigo-200', 'bg-indigo-100'];
    return j < height ? barColors[j] : 'bg-muted';
  }
  // down or neutral
  return j < height ? 'bg-muted' : 'bg-muted';
}

export default function StatisticCard14() {
  const [hoveredBar, setHoveredBar] = React.useState<number | null>(null);
  const barRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8 bg-muted/40 relative">
      <Card className="w-full max-w-sm rounded-2xl shadow-sm p-0">
        <CardContent className="p-6">
          {/* Heading */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-base font-semibold text-foreground">Feature Adoption</div>
              <div className="text-sm text-muted-foreground">Best adoption report</div>
            </div>
            <button className="rounded-full bg-muted w-7 h-7 flex items-center justify-center text-muted-foreground/60">
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Value */}
          <div className="text-5xl font-bold text-foreground mt-2 mb-6">84%</div>

          {/* Bars */}
          <div className="flex items-end gap-2 w-full h-32 mt-2 relative">
            {bars.map((height, i) => (
              <div
                key={i}
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                className="flex flex-col justify-end flex-1 min-w-0 cursor-pointer transition-all"
                style={{ height: '100%' }}
                onMouseEnter={() => setHoveredBar(i)}
                onMouseMove={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {[...Array(maxBars)].map((_, j) => (
                  <div key={j} className={`h-3 my-0.5 rounded ${getBarColor(barInsights[i].direction, j, height)}`} />
                ))}
              </div>
            ))}
            {/* Hover Card (single, fluid) */}
            {hoveredBar !== null && (
              <div
                className="pointer-events-none z-50 absolute"
                style={{
                  left: `calc(${(100 / bars.length) * hoveredBar}% + 50% - 90px)`,
                  top: -90,
                  width: 180,
                  transition: 'left 0.12s cubic-bezier(.4,2,.6,1)',
                }}
              >
                <div className="bg-white rounded-xl shadow-lg border px-4 py-3 text-xs min-w-[160px] max-w-xs animate-none">
                  <div className="font-semibold text-sm mb-1">{barInsights[hoveredBar].date}</div>
                  <div className="mb-1 flex items-center gap-2">
                    <GrowthBadge
                      direction={barInsights[hoveredBar].direction}
                      growth={barInsights[hoveredBar].growth}
                    />
                    <span className="text-muted-foreground">Growth</span>
                  </div>
                  <div className="text-muted-foreground">{barInsights[hoveredBar].note}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
