// Description: Media player controls button group
// Order: 38

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Skip back">
        <IconPlaceholder
          lucide="SkipBackIcon"
          tabler="IconPlayerSkipBack"
          hugeicons="PreviousIcon"
          phosphor="SkipBackIcon"
          remixicon="RiSkipBackLine"
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon" aria-label="Play">
        <IconPlaceholder
          lucide="PlayIcon"
          tabler="IconPlayerPlay"
          hugeicons="PlayIcon"
          phosphor="PlayIcon"
          remixicon="RiPlayLine"
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon" aria-label="Skip forward">
        <IconPlaceholder
          lucide="SkipForwardIcon"
          tabler="IconPlayerSkipForward"
          hugeicons="NextIcon"
          phosphor="SkipForwardIcon"
          remixicon="RiSkipForwardLine"
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  )
}
