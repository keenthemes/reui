// Description: Gradient bar chart
// Order: 7

"use client"

import { CSSProperties, SVGProps } from "react"
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
  { month: "Jan", desktop: 120 },
  { month: "Feb", desktop: 250 },
  { month: "Mar", desktop: 200 },
  { month: "Apr", desktop: 170 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 210 },
  { month: "Jul", desktop: 150 },
  { month: "Aug", desktop: 230 },
  { month: "Sep", desktop: 180 },
  { month: "Oct", desktop: 190 },
  { month: "Nov", desktop: 200 },
  { month: "Dec", desktop: 120 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const CustomGradientBar = (
  props: SVGProps<SVGRectElement> & {
    dataKey?: string
    payload?: any
    index?: number
  }
) => {
  const { fill, x, y, width, height, dataKey } = props
  const barX = x as number
  const barY = y as number
  const barWidth = width as number
  const barHeight = height as number

  return (
    <>
      <defs>
        <linearGradient
          id={`gradient-bar-pattern-${dataKey}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={fill} stopOpacity={0.7} />
          <stop offset="50%" stopColor={fill} stopOpacity={0.4} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <rect
        x={barX}
        y={barY}
        width={barWidth}
        height={barHeight}
        stroke="none"
        fill={`url(#gradient-bar-pattern-${dataKey})`}
        rx="6"
        ry="6"
      />
    </>
  )
}

export default function Pattern() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          Engagement Metrics
          <Badge variant="success-light" className="ml-2">
            <IconPlaceholder
              lucide="TrendingUpIcon"
              tabler="IconTrendingUp"
              hugeicons="TradeUpIcon"
              phosphor="TrendUpIcon"
              remixicon="RiArrowRightUpLongLine"
              aria-hidden="true"
            />
            +2.4%
          </Badge>
        </CardTitle>
        <CardDescription>
          User interaction and click-through rates
        </CardDescription>
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
            barCategoryGap="15%"
          >
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
              fill="var(--color-desktop)"
              shape={<CustomGradientBar />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
