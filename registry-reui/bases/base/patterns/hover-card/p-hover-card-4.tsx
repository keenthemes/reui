// Description: Hover card with icon
// Order: 4

import { ZapIcon } from "lucide-react"

import { Button } from "@/registry/bases/base/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/bases/base/ui/hover-card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <HoverCard>
        <HoverCardTrigger
          delay={100}
          closeDelay={100}
          render={<Button variant="outline">Instant Deployment</Button>}
        />
        <HoverCardContent className="w-80 p-3">
          <div className="flex gap-2">
            <IconPlaceholder
              lucide="ZapIcon"
              tabler="IconBolt"
              hugeicons="ZapIcon"
              phosphor="LightningIcon"
              remixicon="RiFlashlightLine"
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-amber-500"
            />
            <div className="space-y-1">
              <p className="font-medium">Zero Latency Edge</p>
              <p className="text-muted-foreground leading-relaxed">
                Deploy your applications across our global edge network in
                seconds.
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
