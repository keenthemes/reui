// Description: Animated monochrome bar chart
// Order: 11

"use client"

import { CSSProperties, SVGProps, useMemo, useState } from "react"
import { JetBrains_Mono } from "next/font/google"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import { motion } from "motion/react"
import { Bar, BarChart, XAxis } from "recharts"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/bases/base/ui/chart"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

interface CustomBarProps extends SVGProps<SVGSVGElement> {
  setActiveIndex: (index?: number) => void
  index?: number
  activeIndex?: number
  value?: string
}

const CustomBar = (props: CustomBarProps) => {
  const { fill, x, y, width, height, index, activeIndex, value } = props

  // Custom variables
  const xPos = Number(x || 0)
  const realWidth = Number(width || 0)
  const isActive = index === activeIndex
  const collapsedWidth = 6
  // centered bar x-position
  const barX = isActive ? xPos : xPos + (realWidth - collapsedWidth) / 2
  // centered text x-position
  const textX = xPos + realWidth / 2

  // Custom bar shape
  return (
    <g onMouseEnter={() => props.setActiveIndex(index)}>
      {/* rendering the bar with custom position and animated width */}
      <motion.rect
        style={{
          willChange: "transform, width", // helps with performance
        }}
        y={y}
        initial={{ width: collapsedWidth, x: barX }}
        animate={{ width: isActive ? realWidth : collapsedWidth, x: barX }}
        transition={{
          duration: activeIndex === index ? 0.5 : 1,
          type: "spring",
        }}
        height={height}
        fill={fill}
        rx="3"
      />
      {/* Render value text on top of bar */}
      {isActive && (
        <motion.text
          style={{
            willChange: "transform, opacity", // helps with performance
          }}
          className={jetBrainsMono.className}
          key={index}
          initial={{ opacity: 0, y: -10, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
          transition={{ duration: 0.1 }}
          x={textX}
          y={Number(y) - 5}
          textAnchor="middle"
          fill={fill}
        >
          {value}
        </motion.text>
      )}
    </g>
  )
}

const chartData = [
  { month: "January", desktop: 289 },
  { month: "February", desktop: 345 },
  { month: "March", desktop: 412 },
  { month: "April", desktop: 478 },
  { month: "May", desktop: 534 },
  { month: "June", desktop: 456 },
  { month: "July", desktop: 523 },
  { month: "August", desktop: 589 },
  { month: "September", desktop: 467 },
  { month: "October", desktop: 398 },
  { month: "November", desktop: 356 },
  { month: "December", desktop: 423 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export default function Pattern() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const activeData = useMemo(() => {
    if (activeIndex === undefined) return null
    return chartData[activeIndex]
  }, [activeIndex])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Conversion Rates
          <span
            className={cn(
              jetBrainsMono.className,
              "ml-auto text-xl tracking-tighter"
            )}
          >
            ${activeData ? activeData.desktop : "123"}
          </span>
          <Badge variant="success-light">
            <IconPlaceholder
              lucide="TrendingUpIcon"
              tabler="IconTrendingUp"
              hugeicons="TradeUpIcon"
              phosphor="TrendUpIcon"
              remixicon="RiArrowRightUpLongLine"
              aria-hidden="true"
            />
            <span>5.2%</span>
          </Badge>
        </CardTitle>
        <CardDescription>Real-time funnel conversion tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            onMouseLeave={() => setActiveIndex(undefined)}
            margin={{
              top: 20,
              right: 12,
              bottom: 12,
              left: 12,
            }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
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
              shape={
                <CustomBar
                  setActiveIndex={setActiveIndex}
                  activeIndex={activeIndex}
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
