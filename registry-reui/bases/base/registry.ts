import { registryItemSchema, type Registry } from "shadcn/schema"
import { z } from "zod"

import { hooks } from "./hooks/_registry"
import { patterns } from "./patterns/_registry"
import { reui } from "./reui/_registry"

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: z.array(registryItemSchema).parse([...reui, ...hooks, ...patterns]),
} satisfies Registry
