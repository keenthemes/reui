// Description: Ghost button with an invalid state
// Order: 33

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <Button variant="ghost" aria-invalid="true">
      Invalid Ghost
    </Button>
  )
}
