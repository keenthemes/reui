// Description: Filled radar with glowing stroke
// Order: 24

"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/bases/base/ui/chart"

const chartData = [
  { metric: "Speed", value: 88 },
  { metric: "Reliability", value: 94 },
  { metric: "Scalability", value: 72 },
  { metric: "Cost", value: 68 },
  { metric: "Security", value: 82 },
  { metric: "DX", value: 78 },
]

const chartConfig = {
  value: { label: "Score", color: "var(--chart-2)" },
} satisfies ChartConfig

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>Infrastructure Score</CardTitle>
        <CardDescription>Platform performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <RadarChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient id="chart25-fill" x1="0" y1="0" x2="1" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.45}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <filter
                id="chart25-glow"
                x="-15%"
                y="-15%"
                width="130%"
                height="130%"
              >
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <ChartTooltip content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <PolarGrid strokeDasharray="3 3" />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              dataKey="value"
              fill="url(#chart25-fill)"
              stroke="var(--color-value)"
              strokeWidth={2.5}
              filter="url(#chart25-glow)"
              dot={{
                r: 4,
                fill: "var(--background)",
                strokeWidth: 2.5,
                stroke: "var(--color-value)",
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
