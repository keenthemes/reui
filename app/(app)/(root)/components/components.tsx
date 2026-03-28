"use client"

import React from "react"
import Link from "next/link"

import { getCategories, getTotalComponentCount } from "@/lib/registry"
import { Heading } from "@/components/custom/heading"
import { ComponentCategoryCard } from "@/app/(create)/components/components/component-category-card"

export function HomeComponents() {
  const totalCount = getTotalComponentCount()
  const categories = React.useMemo(() => getCategories(), [])

  return (
    <section className="container-wrapper py-12 lg:py-24">
      <div className="container">
        <Heading
          badge="Components"
          title="Components"
          description={
            <>
              {totalCount}+ free, open-source components composed from shadcn/ui
              primitives into production-ready UI. Start from{" "}
              <Link
                href="/components/data-grid"
                className="text-site-primary underline underline-offset-4"
              >
                Data Grid
              </Link>
              ,{" "}
              <Link
                href="/components/filters"
                className="text-site-primary underline underline-offset-4"
              >
                Filters
              </Link>
              ,{" "}
              <Link
                href="/components/file-upload"
                className="text-site-primary underline underline-offset-4"
              >
                File Upload
              </Link>
              ,{" "}
              <Link
                href="/components/kanban"
                className="text-site-primary underline underline-offset-4"
              >
                Kanban
              </Link>
              , or{" "}
              <Link
                href="/components/sortable"
                className="text-site-primary underline underline-offset-4"
              >
                Sortable
              </Link>{" "}
              and browse every category below.
            </>
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <ComponentCategoryCard
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
