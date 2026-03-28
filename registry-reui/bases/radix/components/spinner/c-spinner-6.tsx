// Description: Button loading states
// Order: 6

import { Button } from "@/registry/bases/radix/ui/button"
import { Spinner } from "@/registry/bases/radix/ui/spinner"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button disabled>
        <Spinner />
        Saving...
      </Button>
      <Button variant="outline" disabled>
        <Spinner />
        Loading
      </Button>
      <Button variant="secondary" disabled>
        <Spinner />
        Processing
      </Button>
    </div>
  )
}
