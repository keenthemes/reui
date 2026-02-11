// Description: 3D isometric bar chart
// Order: 8

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
  { month: "Jan", desktop: 340 },
  { month: "Feb", desktop: 870 },
  { month: "Mar", desktop: 510 },
  { month: "Apr", desktop: 620 },
  { month: "May", desktop: 450 },
  { month: "Jun", desktop: 780 },
  { month: "Jul", desktop: 390 },
  { month: "Aug", desktop: 920 },
  { month: "Sep", desktop: 640 },
  { month: "Oct", desktop: 530 },
  { month: "Nov", desktop: 800 },
  { month: "Dec", desktop: 270 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

const True3DBar = (
  props: SVGProps<SVGRectElement> & {
    dataKey?: string
    payload?: any
    index?: number
  }
) => {
  const { fill, x, y, width, height } = props
  const barX = x as number
  const barY = y as number
  const barWidth = width as number
  const barHeight = height as number

  // 3D perspective parameters
  const depth = Math.min(barWidth * 0.3, 15) // Maximum depth of 15px
  const angle = 30 // Isometric angle

  return (
    <g>
      {/* Back face */}
      <rect
        x={barX + depth}
        y={barY - depth}
        width={barWidth}
        height={barHeight}
        fill={fill}
        opacity="0.6"
        rx="3"
      />

      {/* Right side face */}
      <polygon
        points={`${barX + barWidth + 3},${barY - 3} ${barX + barWidth + depth - 3},${barY - depth + 3} ${barX + barWidth + depth - 3},${barY + barHeight - depth - 3} ${barX + barWidth + 3},${barY + barHeight - 3}`}
        fill={fill}
        opacity="0.7"
      />

      {/* Top face */}
      <polygon
        points={`${barX + 3},${barY - 3} ${barX + barWidth - 3},${barY - 3} ${barX + barWidth + depth - 3},${barY - depth + 3} ${barX + depth + 3},${barY - depth + 3}`}
        fill={fill}
        opacity="0.8"
      />

      {/* Front face */}
      <rect
        x={barX}
        y={barY}
        width={barWidth}
        height={barHeight}
        fill={fill}
        rx="3"
      />
    </g>
  )
}

export default function Chart3D() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          Financial Forecast
          <Badge variant="destructive-light" className="ml-2">
            <IconPlaceholder
              lucide="TrendingDownIcon"
              tabler="IconTrendingDown"
              hugeicons="TradeDownIcon"
              phosphor="TrendDownIcon"
              remixicon="RiArrowRightDownLongLine"
              aria-hidden="true"
            />
            +8.2%
          </Badge>
        </CardTitle>
        <CardDescription>Projected vs actual revenue growth</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 40,
              right: 40,
              bottom: 20,
              left: 20,
            }}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
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
              shape={<True3DBar />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
