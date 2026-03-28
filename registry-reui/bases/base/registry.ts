import { registryItemSchema, type Registry } from "shadcn/schema"
import { z } from "zod"

import { components } from "./components/_registry"
import { hooks } from "./hooks/_registry"
import { reui } from "./reui/_registry"

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: z.array(registryItemSchema).parse([...reui, ...hooks, ...components]),
} satisfies Registry
