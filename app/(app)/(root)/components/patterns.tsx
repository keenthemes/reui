"use client"

import React from "react"
import Link from "next/link"

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
          title="Patterns"
          description={
            <>
              {totalCount} free and open-source patterns composed from shadcn/ui
              primitives into real-world product UI.{" "}
              <Link
                href="/patterns/data-grid"
                className="text-site-primary underline underline-offset-4"
              >
                Data Grid
              </Link>
              ,{" "}
              <Link
                href="/patterns/filters"
                className="text-site-primary underline underline-offset-4"
              >
                Filters
              </Link>
              ,{" "}
              <Link
                href="/patterns/file-upload"
                className="text-site-primary underline underline-offset-4"
              >
                File Upload
              </Link>
              ,{" "}
              <Link
                href="/patterns/kanban"
                className="text-site-primary underline underline-offset-4"
              >
                Kanban
              </Link>
              , and{" "}
              <Link
                href="/patterns/sortable"
                className="text-site-primary underline underline-offset-4"
              >
                Sortable
              </Link>{" "}
              are some of the most useful starting points for your next project.
            </>
          }
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
