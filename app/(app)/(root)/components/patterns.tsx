"use client"

import React from "react"

import { getCategories, getPatternsTotalCount } from "@/lib/registry"
import { Heading } from "@/components/custom/heading"
import { PatternsCategoryCard } from "@/app/(create)/patterns/components/patterns-category-card"

export function Patterns() {
  const totalCount = getPatternsTotalCount()
  const categories = React.useMemo(() => getCategories(), [])

  return (
    <section className="container-wrapper py-12 lg:py-24">
      <div className="container">
        <Heading
          badge="Patterns"
          title={
            <div className="flex-colitems-center flex gap-2">Patterns</div>
          }
          description={`${totalCount} patterns composed from core primitives into real-world use cases for your projects.`}
        />
        {/* Content */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <PatternsCategoryCard
              key={cat.name}
              name={cat.name}
              label={cat.label}
              count={cat.count}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
