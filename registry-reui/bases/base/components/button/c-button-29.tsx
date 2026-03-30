// Description: Link button with an icon on the right
// Order: 29

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Button variant="link" className="group/link-button">
      View Documentation
      <IconPlaceholder
        lucide="ArrowUpRightIcon"
        tabler="IconArrowUpRight"
        hugeicons="ArrowUpRight01Icon"
        phosphor="ArrowUpRightIcon"
        remixicon="RiArrowRightUpLine"
        aria-hidden="true"
        className="transition-transform group-hover/link-button:rotate-45"
      />
    </Button>
  )
}
