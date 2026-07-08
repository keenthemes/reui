/**
 * Globally shared, build-generated registry statistics.
 *
 * Single source of truth for every "how many X" figure shown in the
 * customer-facing copy (FAQ, SEO text, tooltips). Values are read from the
 * pre-generated registry meta under `registry-reui/_meta/components`, so the
 * numbers never drift from the shipped library and nothing is counted at
 * runtime. Plain static JSON reads - safe to import from client components.
 */
import componentsMeta from "@/registry-reui/_meta/components/registry.json"

const components = componentsMeta as { totalComponents: number }

/** Free shadcn component examples (the `c-*` registry blocks). */
export const COMPONENTS_TOTAL = components.totalComponents

/**
 * Count of ReUI custom primitives - the in-house components not found in base
 * shadcn/ui (Data Grid, Kanban, Filters, Stepper, Tree, and more). Hand-
 * maintained: the registry enumerates finer-grained sub-parts, so the build-
 * derived `totalComponents` never matches this marketed number. Update by hand
 * when the primitive lineup changes.
 */
export const CUSTOM_PRIMITIVES_TOTAL = 17
