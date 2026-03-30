import Link from "next/link"

import { getCategories, getTotalComponentCount } from "@/lib/registry"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/custom/heading"
import { HomeComponentCategoryCard } from "@/app/(app)/(root)/components/home-component-category-card"

export function HomeComponents() {
  const totalCount = getTotalComponentCount()
  const categories = [...getCategories()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  return (
    <section className="container-wrapper py-12 [contain-intrinsic-size:1px_1200px] [content-visibility:auto] lg:py-24">
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
                prefetch={false}
                className="text-site-primary underline underline-offset-4"
              >
                Data Grid
              </Link>
              ,{" "}
              <Link
                href="/components/filters"
                prefetch={false}
                className="text-site-primary underline underline-offset-4"
              >
                Filters
              </Link>
              ,{" "}
              <Link
                href="/components/file-upload"
                prefetch={false}
                className="text-site-primary underline underline-offset-4"
              >
                File Upload
              </Link>
              ,{" "}
              <Link
                href="/components/kanban"
                prefetch={false}
                className="text-site-primary underline underline-offset-4"
              >
                Kanban
              </Link>
              , or{" "}
              <Link
                href="/components/sortable"
                prefetch={false}
                className="text-site-primary underline underline-offset-4"
              >
                Sortable
              </Link>{" "}
              and explore the most-used categories below.
            </>
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <HomeComponentCategoryCard
              key={cat.name}
              name={cat.name}
              label={cat.label}
              count={cat.count}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/components">Explore all {totalCount}+ components</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
