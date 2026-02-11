// Description: Large (lg) icon-only button
// Order: 26

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Button size="icon-lg" aria-label="Play">
      <IconPlaceholder
        lucide="PlayIcon"
        tabler="IconPlayerPlay"
        hugeicons="PlayIcon"
        phosphor="PlayIcon"
        remixicon="RiPlayLine"
        aria-hidden="true"
      />
    </Button>
  )
}
