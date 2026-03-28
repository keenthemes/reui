// Description: Donut chart with center total
// Order: 19

"use client"

import { CSSProperties } from "react"
import { Cell, Label, Pie, PieChart } from "recharts"

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
  { source: "direct", visits: 4200, fill: "var(--color-direct)" },
  { source: "search", visits: 3600, fill: "var(--color-search)" },
  { source: "social", visits: 2800, fill: "var(--color-social)" },
  { source: "email", visits: 1900, fill: "var(--color-email)" },
  { source: "referral", visits: 1400, fill: "var(--color-referral)" },
]

const total = chartData.reduce((s, d) => s + d.visits, 0)

const chartConfig = {
  visits: { label: "Visits" },
  direct: { label: "Direct", color: "var(--chart-1)" },
  search: { label: "Search", color: "var(--chart-2)" },
  social: { label: "Social", color: "var(--chart-3)" },
  email: { label: "Email", color: "var(--chart-4)" },
  referral: { label: "Referral", color: "var(--chart-5)" },
} satisfies ChartConfig

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>Where your visitors come from</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <PieChart accessibilityLayer>
            <defs>
              <filter
                id="chart19-3d"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="5"
                  floodOpacity="0.2"
                />
              </filter>
              <linearGradient id="gradient-direct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient id="gradient-search" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient id="gradient-social" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient id="gradient-email" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-4)"
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient
                id="gradient-referral"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-5)"
                  stopOpacity={0.8}
                />
              </linearGradient>
            </defs>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-40 gap-2.5"
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-xs bg-(--color-bg)"
                          style={
                            {
                              "--color-bg": `var(--color-${name})`,
                            } as CSSProperties
                          }
                        />
                        <span className="text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}
                        </span>
                      </div>
                      <span className="text-foreground font-semibold tabular-nums">
                        {Number(value).toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="visits"
              nameKey="source"
              innerRadius={65}
              outerRadius={95}
              cornerRadius={8}
              paddingAngle={4}
              stroke="var(--background)"
              strokeWidth={4}
              style={{ filter: "url(#chart19-3d)" }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${entry.source})`}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold tabular-nums"
                        >
                          {(total / 1000).toFixed(1)}k
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 22}
                          className="fill-muted-foreground text-xs"
                        >
                          Total Visits
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
