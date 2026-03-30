// Description: Step area chart with dotted pattern fill
// Order: 15

"use client"

import { CSSProperties } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const chartData = [
  { month: "January", connections: 48 },
  { month: "February", connections: 62 },
  { month: "March", connections: 62 },
  { month: "April", connections: 85 },
  { month: "May", connections: 85 },
  { month: "June", connections: 110 },
  { month: "July", connections: 110 },
  { month: "August", connections: 135 },
]

const chartConfig = {
  connections: {
    label: "Connections",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function Pattern() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          Active Connections
          <Badge variant="success-light" className="ml-2">
            <IconPlaceholder
              lucide="TrendingUpIcon"
              tabler="IconTrendingUp"
              hugeicons="TradeUpIcon"
              phosphor="TrendUpIcon"
              remixicon="RiArrowRightUpLongLine"
              aria-hidden="true"
            />
            +257%
          </Badge>
        </CardTitle>
        <CardDescription>Server connection pool over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 2, bottom: 0, left: 2 }}
          >
            <defs>
              <pattern
                id="chart15-dot-pattern"
                patternUnits="userSpaceOnUse"
                width="5"
                height="5"
              >
                <rect
                  width="5"
                  height="5"
                  fill="var(--color-connections)"
                  opacity="0.08"
                />
                <circle
                  cx="2.5"
                  cy="2.5"
                  r="1"
                  fill="var(--color-connections)"
                  opacity="0.5"
                />
              </pattern>
              <linearGradient
                id="chart15-stroke-grad"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-connections)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-connections)"
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="min-w-40 gap-2.5"
                  labelFormatter={(value) => (
                    <div className="border-border/50 mb-0.5 border-b pb-2">
                      <span className="text-xs font-medium">{value} 2024</span>
                    </div>
                  )}
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
            <Area
              dataKey="connections"
              type="stepAfter"
              fill="url(#chart15-dot-pattern)"
              stroke="var(--color-connections)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
