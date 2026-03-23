"use client"

import React from "react"
import { Box, Component, Layers, Server } from "lucide-react"

import { getPatternsTotalCount } from "@/lib/registry"
import { Card } from "@/components/custom/card"

export function Stats() {
  const patternsTotalCount = getPatternsTotalCount()

  const stats = [
    {
      icon: Box,
      title: `100% Free & Open-Source`,
      description:
        "The most complete open-source shadcn library loved by devs and teams around the world.",
    },
    {
      icon: Layers,
      title: `${patternsTotalCount}+ Patterns`,
      description:
        "Reusable solutions composed from shadcn/ui primitives into real-world product flows.",
    },
    {
      icon: Component,
      title: "Shadcn Create Compatible",
      description:
        "All components and patterns are compatible with all 5 shadcn create styles.",
    },
    {
      icon: Server,
      title: "Dual Library Support",
      description:
        "ReUI ships canonical Base UI docs plus matching Radix UI implementations for the same high-value components.",
    },
  ]

  return (
    <section className="container-wrapper py-4">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <div className="flex items-center justify-start">
                <stat.icon
                  className="text-site-foreground/70 size-5"
                  strokeWidth={1.5}
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-site-foreground text-base font-semibold tracking-tight">
                  {stat.title}
                </h3>
                <p className="text-site-muted-foreground text-sm leading-relaxed font-medium">
                  {stat.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
