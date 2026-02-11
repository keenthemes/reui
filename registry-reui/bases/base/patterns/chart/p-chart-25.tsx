// Description: Lighthouse scores radial with labels
// Order: 25

"use client"

import { CSSProperties } from "react"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/bases/base/ui/chart"

const chartData = [
  { name: "mobile", score: 58, fill: "url(#chart28-mobile)" },
  { name: "desktop", score: 76, fill: "url(#chart28-desktop)" },
  { name: "api", score: 92, fill: "url(#chart28-api)" },
]

const chartConfig = {
  score: { label: "Score" },
  mobile: { label: "Mobile", color: "var(--chart-4)" },
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  api: { label: "API", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>Lighthouse Scores</CardTitle>
        <CardDescription>Performance audit by platform</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={35}
            outerRadius={110}
            barSize={22}
          >
            <defs>
              {(["mobile", "desktop", "api"] as const).map((key) => (
                <linearGradient
                  key={key}
                  id={`chart28-${key}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="100%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={1}
                  />
                </linearGradient>
              ))}
              <filter
                id="chart28-glow"
                x="-15%"
                y="-15%"
                width="130%"
                height="130%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-40 gap-2.5"
                  nameKey="name"
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
                        {Number(value)}/100
                      </span>
                    </div>
                  )}
                />
              }
            />
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="score"
              background
              cornerRadius={10}
              filter="url(#chart28-glow)"
              label={{
                position: "insideStart",
                fill: "#fff",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
