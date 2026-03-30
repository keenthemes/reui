// Description: Outline like button with count
// Order: 37

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Button className="pe-0">
      <IconPlaceholder
        lucide="ThumbsUpIcon"
        tabler="IconThumbUp"
        hugeicons="ThumbsUpIcon"
        phosphor="ThumbsUpIcon"
        remixicon="RiThumbUpLine"
        aria-hidden="true"
      />
      Like
      <span className="relative ms-1 px-3 text-xs font-medium opacity-80 before:absolute before:inset-0 before:left-0 before:w-px before:bg-[currentColor]/60">
        456
      </span>
    </Button>
  )
}
