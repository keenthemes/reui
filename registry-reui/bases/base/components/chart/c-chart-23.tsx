// Description: Radar chart with gradient fill
// Order: 23

"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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
  { skill: "Frontend", score: 92 },
  { skill: "Backend", score: 78 },
  { skill: "DevOps", score: 68 },
  { skill: "Design", score: 74 },
  { skill: "Testing", score: 85 },
  { skill: "Security", score: 62 },
]

const chartConfig = {
  score: { label: "Proficiency", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>Skill Assessment</CardTitle>
        <CardDescription>Team proficiency across key areas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <RadarChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient id="chart24-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-score)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-score)"
                  stopOpacity={0.08}
                />
              </linearGradient>
              <filter
                id="chart24-glow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <ChartTooltip content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
            <PolarGrid strokeDasharray="3 3" />
            <Radar
              dataKey="score"
              fill="url(#chart24-fill)"
              stroke="var(--color-score)"
              strokeWidth={2}
              filter="url(#chart24-glow)"
              dot={{ r: 4, fill: "var(--color-score)", strokeWidth: 0 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
