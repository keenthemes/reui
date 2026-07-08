// Vercel Web Analytics custom events are DISABLED for now (to reduce event
// volume). Re-enable by uncommenting this import and the `va.track(...)` call
// in `trackEvent` below. Pageview analytics (<Analytics>) is unaffected.
// import va from "@vercel/analytics"
import { z } from "zod"

const eventSchema = z.object({
  name: z.enum([
    "copy_command",
    "copy_component_cli",
    "copy_icon_code",
    "copy_component_code",
    "copy_component_path",
    "registry_access",
  ]),
  // declare type AllowedPropertyValues = string | number | boolean | null
  properties: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),
})

export type Event = z.infer<typeof eventSchema>

export function trackEvent(input: Event): void {
  // Custom events disabled — validate for type-safety at call sites but do NOT
  // send to Vercel Web Analytics. To re-enable, restore the `va` import above
  // and uncomment the `va.track` line.
  eventSchema.parse(input)
  // va.track(event.name, event.properties)
}
