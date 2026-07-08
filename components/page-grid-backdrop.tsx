import { cn } from "@/lib/utils"

const GRID_TEXTURE =
  "bg-[linear-gradient(to_right,var(--color-site-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-site-border)_1px,transparent_1px)] bg-[size:3px_3px]"

const VARIANTS = {
  // Page header: anchored to the very top of the page, solid at the top edge
  // and dissolved by mid-screen. Tuned to sit behind a hero.
  page: "h-[50vh] opacity-45 [mask-image:linear-gradient(to_bottom,#000,transparent_50%)]",
  // Section heading halo: full at the very top, then the texture blends away
  // and is fully transparent by ~4% of the band. The band is tall (so 4% spans
  // a real strip down through the heading area) before it dissolves into the
  // section background. Reused across the lower marketing sections (Free
  // Components, Crafted, Feedback, FAQ) for a consistent feel.
  section:
    "h-[2600px] opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent_4%)]",
} as const

/**
 * The shared grid-texture backdrop. `variant="page"` is the global page-top
 * effect (used by the site shells); `variant="section"` is the localized
 * heading halo for lower sections, with an early top fade that blends fully
 * into the section background.
 *
 * It renders above the base background color but behind page content (z-0), so
 * it expects a positioned ancestor whose content paints above it - give the
 * section `relative` and let the content opt into `relative z-10`. `className`
 * is merged last, so height/opacity/mask utilities there win over the variant.
 */
export function PageGridBackdrop({
  variant = "page",
  className,
}: {
  variant?: keyof typeof VARIANTS
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0",
        GRID_TEXTURE,
        VARIANTS[variant],
        className
      )}
    />
  )
}
