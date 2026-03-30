// Description: Stacked area chart with dashed strokes
// Order: 14

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
  { month: "January", organic: 1200, paid: 580, referral: 320 },
  { month: "February", organic: 1450, paid: 620, referral: 380 },
  { month: "March", organic: 1380, paid: 540, referral: 420 },
  { month: "April", organic: 1650, paid: 710, referral: 460 },
  { month: "May", organic: 1520, paid: 680, referral: 390 },
  { month: "June", organic: 1800, paid: 750, referral: 510 },
]

const chartConfig = {
  organic: { label: "Organic", color: "var(--chart-1)" },
  paid: { label: "Paid", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
} satisfies ChartConfig

export default function Pattern() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          Traffic Sources
          <Badge variant="success-light" className="ml-2">
            <IconPlaceholder
              lucide="TrendingUpIcon"
              tabler="IconTrendingUp"
              hugeicons="TradeUpIcon"
              phosphor="TrendUpIcon"
              remixicon="RiArrowRightUpLongLine"
              aria-hidden="true"
            />
            +18.3%
          </Badge>
        </CardTitle>
        <CardDescription>Visitor acquisition by channel</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              {(["organic", "paid", "referral"] as const).map((key) => (
                <linearGradient
                  key={key}
                  id={`chart14-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
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
              dataKey="referral"
              type="natural"
              stackId="1"
              fill="url(#chart14-referral)"
              fillOpacity={0.4}
              stroke="var(--color-referral)"
              strokeWidth={0.8}
              strokeDasharray="3 3"
            />
            <Area
              dataKey="paid"
              type="natural"
              stackId="1"
              fill="url(#chart14-paid)"
              fillOpacity={0.4}
              stroke="var(--color-paid)"
              strokeWidth={0.8}
              strokeDasharray="3 3"
            />
            <Area
              dataKey="organic"
              type="natural"
              stackId="1"
              fill="url(#chart14-organic)"
              fillOpacity={0.4}
              stroke="var(--color-organic)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
