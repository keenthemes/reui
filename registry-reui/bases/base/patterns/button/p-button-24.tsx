// Description: Extra small icon button
// Order: 24

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Button size="icon-xs" variant="outline" aria-label="Close">
      <IconPlaceholder
        lucide="XIcon"
        tabler="IconX"
        hugeicons="MultiplicationSignIcon"
        phosphor="XIcon"
        remixicon="RiCloseLine"
        aria-hidden="true"
      />
    </Button>
  )
}
