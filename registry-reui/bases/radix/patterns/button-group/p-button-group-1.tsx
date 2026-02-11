// Description: Basic button group with two buttons
// Order: 1

import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">Button</Button>
      <Button variant="outline">Another Button</Button>
    </ButtonGroup>
  )
}
