// Description: Spinner color variants
// Order: 12

import { Spinner } from "@/registry/bases/base/ui/spinner"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Spinner className="size-4 text-blue-500" />
      <Spinner className="size-4 text-green-500" />
      <Spinner className="size-4 text-red-500" />
      <Spinner className="size-4 text-yellow-500" />
      <Spinner className="size-4 text-purple-500" />
    </div>
  )
}
