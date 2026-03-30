// Description: Striped and solid bar chart
// Order: 5

"use client"

import { CSSProperties } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import { Bar, BarChart, XAxis } from "recharts"

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
  { month: "Jan", desktop: 340, mobile: 180 },
  { month: "Feb", desktop: 870, mobile: 420 },
  { month: "Mar", desktop: 510, mobile: 280 },
  { month: "Apr", desktop: 620, mobile: 350 },
  { month: "May", desktop: 450, mobile: 240 },
  { month: "Jun", desktop: 780, mobile: 390 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function ChartBarPattern() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          User Acquisition
          <Badge variant="destructive-light" className="ml-2">
            <IconPlaceholder
              lucide="TrendingDownIcon"
              tabler="IconTrendingDown"
              hugeicons="TradeDownIcon"
              phosphor="TrendDownIcon"
              remixicon="RiArrowRightDownLongLine"
              aria-hidden="true"
            />
            -15%
          </Badge>
        </CardTitle>
        <CardDescription>Quarterly user growth tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 12,
              bottom: 12,
              left: 12,
            }}
          >
            <defs>
              <pattern
                id="chart3-diagonal-stripe-pattern"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
              >
                <rect
                  width="8"
                  height="8"
                  fill="var(--color-desktop)"
                  opacity="0.1"
                />
                <path
                  d="M0,8 L8,0 M4,12 L12,4 M-4,4 L4,-4"
                  stroke="var(--color-desktop)"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <path
                  d="M2,10 L10,2 M6,14 L14,6 M-2,6 L6,-2"
                  stroke="var(--color-desktop)"
                  strokeWidth="1"
                  opacity="0.3"
                />
              </pattern>
              <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity="0.9"
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity="0.6"
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="min-w-40 gap-2.5"
                  labelFormatter={(value) => {
                    return (
                      <div className="border-border/50 mb-0.5 flex flex-col gap-0.5 border-b pb-2">
                        <span className="text-xs font-medium">
                          {value} 2024
                        </span>
                      </div>
                    )
                  }}
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
                      <span className="text-foreground font-semibold">
                        {value.toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey="desktop"
              fill="url(#chart3-diagonal-stripe-pattern)"
              stroke="var(--color-desktop)"
              strokeWidth={1}
              radius={[4, 4, 4, 4]}
            />
            <Bar
              dataKey="mobile"
              fill="var(--color-mobile)"
              stroke="var(--color-mobile)"
              strokeWidth={1}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
