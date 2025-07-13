import { Italic } from "lucide-react"

import { Toggle } from "@/registry/default/ui/toggle"

export default function Component() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic />
      Italic
    </Toggle>
  )
}
