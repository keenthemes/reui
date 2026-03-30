import { Box, Component, Layers, Server } from "lucide-react"

import { getTotalComponentCount } from "@/lib/registry"
import { Card } from "@/components/custom/card"

export function Stats() {
  const totalComponentCount = getTotalComponentCount()

  const stats = [
    {
      icon: Box,
      title: `Free & Open-Source Core`,
      description:
        "The most complete open-source shadcn component library loved by devs around the world.",
    },
    {
      icon: Layers,
      title: `${totalComponentCount}+ Components`,
      description:
        "Reusable solutions composed from shadcn/ui primitives into real-world product flows.",
    },
    {
      icon: Component,
      title: "Shadcn Create Compatible",
      description:
        "All components are compatible with all 5 Shadcn Create styles and settings.",
    },
    {
      icon: Server,
      title: "Dual Library Support",
      description:
        "ReUI supports both Base UI and Radix UI library versions of all components.",
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
