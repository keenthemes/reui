// Description: Basic spinner.
// Order: 1

import { Spinner } from "@/registry/bases/radix/ui/spinner"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center gap-6">
      <Spinner />
    </div>
  )
}
