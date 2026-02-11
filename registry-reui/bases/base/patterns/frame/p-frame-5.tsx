// Description: Frame with collapsible panels
// Order: 5

import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/bases/base/ui/collapsible"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Frame className="w-full" stacked>
      <Collapsible defaultOpen className="group/collapsible">
        <CollapsibleTrigger className="w-full">
          <FrameHeader className="flex grow flex-row items-center justify-between gap-2">
            <FrameTitle>Start</FrameTitle>
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              className="text-muted-foreground size-4 transition-transform duration-200 group-data-open/collapsible:rotate-90"
            />
          </FrameHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <FramePanel>
            <p className="text-muted-foreground text-sm">
              Initialize run to answer a user question using uploaded files and
              the knowledge base; cite sources when relevant.
            </p>
          </FramePanel>
        </CollapsibleContent>
      </Collapsible>
    </Frame>
  )
}
