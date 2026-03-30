// Description: Nested button groups for complex action sets
// Order: 9

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="SendIcon"
            tabler="IconSend"
            hugeicons="SentIcon"
            phosphor="PaperPlaneTiltIcon"
            remixicon="RiSendInsLine"
            aria-hidden="true"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput placeholder="Send a message..." />
          <Tooltip>
            <TooltipTrigger render={<InputGroupAddon align="inline-end" />}>
              <IconPlaceholder
                lucide="AudioLinesIcon"
                tabler="IconBrandGooglePodcasts"
                hugeicons="AudioWave01Icon"
                phosphor="WaveformIcon"
                remixicon="RiVoiceprintLine"
                aria-hidden="true"
              />
            </TooltipTrigger>
            <TooltipContent>Voice Mode</TooltipContent>
          </Tooltip>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}
