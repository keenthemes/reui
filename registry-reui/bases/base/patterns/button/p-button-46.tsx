// Description: Button with status dot badge
// Order: 46

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <Button
      variant="outline"
      className="relative pr-8"
      aria-label="Deploy (ready)"
    >
      Live
      <span
        aria-hidden="true"
        className="absolute top-1/2 right-3 -translate-y-1/2"
      >
        <span className="relative flex size-2 rounded-full bg-emerald-500 before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-emerald-400 before:opacity-75 before:duration-1500 after:absolute after:inset-0 after:animate-ping after:rounded-full after:bg-emerald-400 after:opacity-40 after:delay-500 after:duration-1500" />
      </span>
    </Button>
  )
}
