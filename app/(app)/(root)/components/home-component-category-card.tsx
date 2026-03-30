import Image from "next/image"
import Link from "next/link"

import { normalizeSlug } from "@/lib/utils"

export function HomeComponentCategoryCard({
  name,
  label,
  count,
}: {
  name: string
  label: string
  count: number
}) {
  const slug = normalizeSlug(name)

  return (
    <Link
      href={`/components/${slug}`}
      prefetch={false}
      className="group/thumbnail bg-site-muted/50 dark:bg-site-background border-site-border/60 site-rounded-xl flex flex-col border p-0.5 shadow-sm shadow-black/5"
    >
      <div className="bg-site-background border-site-border/60 site-rounded-xl relative overflow-hidden border">
        <Image
          src={`/screenshots/components/${slug}-light.png`}
          alt={label}
          width={600}
          height={400}
          className="w-full object-cover transition-all duration-300 dark:hidden"
        />
        <Image
          src={`/screenshots/components/${slug}-dark.png`}
          alt={label}
          width={600}
          height={400}
          className="hidden w-full object-cover transition-all duration-300 dark:block"
        />
      </div>
      <div className="flex items-center justify-between gap-px px-3 py-2.5">
        <h3 className="text-site-foreground text-base font-medium tracking-tight">
          {label}
        </h3>
        <span className="text-site-muted-foreground text-xs font-normal">
          {count} {count === 1 ? "component" : "components"}
        </span>
      </div>
    </Link>
  )
}
